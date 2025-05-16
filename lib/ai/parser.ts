import { ParsedLogEntry } from '../types';

// Regular expression to extract JSON between <log_data> tags
const logDataRegex = /<log_data>([\s\S]*?)<\/log_data>/;

// Function to parse the AI's response into structured data
export function parseLogDataFromAIResponse(aiText: string): ParsedLogEntry[] | null {
  const match = aiText.match(logDataRegex);
  
  if (!match || !match[1]) {
    return null;
  }
  
  try {
    const jsonData = JSON.parse(match[1].trim());
    
    // Handle both single object and array of objects
    const entries = Array.isArray(jsonData) ? jsonData : [jsonData];
    
    // Validate each entry has required fields
    return entries.map(entry => {
      if (!entry.exerciseName || typeof entry.weightKg !== 'number' || 
          !entry.sets || !Array.isArray(entry.repsPerSet) || !entry.date) {
        throw new Error('Invalid log data format');
      }
      
      return {
        exerciseName: entry.exerciseName,
        weightKg: entry.weightKg,
        sets: entry.sets,
        repsPerSet: entry.repsPerSet,
        date: entry.date,
        notes: entry.notes || null
      };
    });
  } catch (error) {
    console.error('Error parsing log data:', error);
    return null;
  }
}

export type { ParsedLogEntry };
