import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import { getWorkoutGenerationPrompt, getWorkoutLoggingPrompt } from '../../../lib/ai/prompts';
import { parseLogDataFromAIResponse, ParsedLogEntry } from '../../../lib/ai/parser';
import prisma from '../../../lib/db';

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple intent detection based on keywords
function detectIntent(message: string): 'workout_generation' | 'workout_logging' | 'general_question' {
  const lowerMessage = message.toLowerCase();
  
  // Check for workout generation intent
  if (
    lowerMessage.includes('create workout') ||
    lowerMessage.includes('generate workout') ||
    lowerMessage.includes('plan workout') ||
    lowerMessage.includes('workout plan') ||
    lowerMessage.includes('training plan') ||
    lowerMessage.includes('program for') ||
    lowerMessage.includes('routine for')
  ) {
    return 'workout_generation';
  }
  
  // Check for workout logging intent
  if (
    lowerMessage.includes('did') ||
    lowerMessage.includes('completed') ||
    lowerMessage.includes('finished') ||
    lowerMessage.includes('logged') ||
    lowerMessage.includes('today i') ||
    lowerMessage.includes('sets of') ||
    lowerMessage.includes('reps of') ||
    lowerMessage.includes('kg') ||
    lowerMessage.includes('lbs')
  ) {
    return 'workout_logging';
  }
  
  // Default to general question
  return 'general_question';
}

// Function to log workout data to the database
async function logWorkoutData(parsedEntries: ParsedLogEntry[]): Promise<void> {
  if (!parsedEntries || !Array.isArray(parsedEntries)) {
    throw new Error('Invalid workout entries format');
  }

  // Create or find a workout session for today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  try {
    let workoutSession = await prisma.workoutSession.findFirst({
      where: {
        date: {
          equals: today,
        },
      },
    });

    if (!workoutSession) {
      try {
        workoutSession = await prisma.workoutSession.create({
          data: {
            date: today,
            name: 'Today\'s Workout',
          },
        });
      } catch (createError) {
        console.error('Error creating workout session:', createError);
        throw new Error('Failed to create workout session');
      }
    }

    // Create exercise logs for each entry
    for (const entry of parsedEntries) {
      try {
        if (!entry.exerciseName || !entry.weightKg || !entry.sets || !entry.repsPerSet) {
          throw new Error('Missing required workout data');
        }

        await prisma.exerciseLog.create({
          data: {
            exerciseName: entry.exerciseName,
            weightKg: entry.weightKg,
            sets: entry.sets,
            repsPerSet: entry.repsPerSet,
            notes: entry.notes,
            workoutSessionId: workoutSession.id,
          },
        });
      } catch (error) {
        console.error(`Error logging exercise entry ${entry.exerciseName}:`, error);
        throw new Error(`Failed to log exercise entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  } catch (error) {
    console.error('Database error when logging workout data:', error);
    throw new Error('Failed to log workout data');
  }
}

export const POST = async (req: Request) => {
  try {
    // Validate request
    if (!req.body) {
      return new Response(JSON.stringify({ error: 'No request body provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = await req.json();
    
    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the latest user message for intent detection
    const latestUserMessage = messages[messages.length - 1].content;
    if (!latestUserMessage) {
      return new Response(JSON.stringify({ error: 'No user message found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const intent = detectIntent(latestUserMessage);
    
    // Get appropriate system prompt based on intent
    let systemPrompt: string;
    try {
      switch (intent) {
        case 'workout_generation':
          systemPrompt = getWorkoutGenerationPrompt(latestUserMessage);
          break;
        case 'workout_logging':
          systemPrompt = getWorkoutLoggingPrompt(latestUserMessage);
          break;
        case 'general_question':
        default:
          systemPrompt = getWorkoutGenerationPrompt(latestUserMessage);
          break;
      }
    } catch (promptError) {
      console.error('Error generating system prompt:', promptError);
      return new Response(JSON.stringify({ error: 'Failed to generate system prompt' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construct full prompt array for OpenAI
    const fullPromptArray = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    // Call OpenAI API with enhanced error handling
    let response;
    try {
      response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: fullPromptArray,
      });
    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError);
      
      // Handle rate limiting
      if (openaiError.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Handle authentication errors
      if (openaiError.status === 401) {
        return new Response(JSON.stringify({ error: 'API authentication error. Please check your API key.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Handle other API errors
      if (openaiError.response?.data?.error?.message) {
        return new Response(JSON.stringify({ error: openaiError.response.data.error.message }), {
          status: openaiError.status || 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'Error communicating with AI service. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a readable stream from the OpenAI response
    const stream = Readable.from(response);
    
    // Handle completion for workout logging
    let completionText = '';
    let errorOccurred = false;
    
    stream.on('data', (chunk) => {
      const text = chunk.toString();
      completionText += text;
    });
    
    stream.on('end', async () => {
      // Process workout logging intent
      if (intent === 'workout_logging' && !errorOccurred) {
        try {
          const parsedData = parseLogDataFromAIResponse(completionText);
          if (parsedData) {
            try {
              await logWorkoutData(parsedData);
              console.log('Workout data logged successfully');
            } catch (dbError) {
              console.error('Database error when logging workout data:', dbError);
              errorOccurred = true;
            }
          }
        } catch (parseError) {
          console.error('Error parsing workout data:', parseError);
          errorOccurred = true;
        }
      }
    });
    
    // Return streaming response
    return NextResponse.json({ stream });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to process request',
      type: error instanceof Error ? error.name : 'UnknownError'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export default { POST };
