// Types for workout logging
export interface ParsedLogEntry {
  exerciseName: string;
  weightKg: number;
  sets: number;
  repsPerSet: number[];
  date: string;
  notes: string | null;
}

// Types for dashboard charts
export interface PRChartData {
  date: string;
  prValue: number;
}

export interface VolumeChartData {
  weekStartDate: string;
  totalVolume: number;
}
