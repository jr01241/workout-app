import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate estimated 1RM using Epley formula
export function calculateEstimated1RM(weight: number, reps: number): number {
  // Only calculate e1RM for reps between 1-12 for better accuracy
  if (reps < 1 || reps > 12 || weight <= 0) {
    return 0;
  }
  
  // Epley formula: weight * (1 + reps/30)
  const e1RM = weight * (1 + reps / 30);
  return parseFloat(e1RM.toFixed(1)); // Round to 1 decimal place
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get the start date of a week (Monday) for a given date
export function getWeekStartDate(date: Date): Date {
  const dayOfWeek = date.getDay() || 7; // Convert Sunday (0) to 7
  const diff = dayOfWeek - 1; // Monday is 1, so diff is days since Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Calculate total volume for an exercise log
export function calculateVolume(weight: number, reps: number[], sets: number): number {
  // If reps is a single number, create an array with that number repeated for each set
  const repsArray = Array.isArray(reps) ? reps : Array(sets).fill(reps);
  
  // Calculate total volume (weight * reps * sets)
  let totalVolume = 0;
  for (let i = 0; i < sets; i++) {
    totalVolume += weight * repsArray[i];
  }
  
  return totalVolume;
}

// Calculate average weight for an exercise log
export function calculateAverageWeight(weight: number, sets: number): number {
  if (sets === 0) {
    return 0;
  }
  return parseFloat((weight / sets).toFixed(1));
}
