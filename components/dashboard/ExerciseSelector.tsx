'use client';

import { useState, useEffect } from 'react';
import { getExercisesList } from '@/lib/actions/dashboard.actions';

interface ExerciseSelectorProps {
  initialExercise: string;
  onExerciseChange: (exercise: string) => Promise<void>;
  className?: string;
}

export function ExerciseSelector({ initialExercise, onExerciseChange, className = '' }: ExerciseSelectorProps) {
  const [exercises, setExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true);
        setError(null);
        const exercisesList = await getExercisesList({ userId: undefined });
        setExercises(exercisesList);
      } catch (error) {
        console.error('Failed to load exercises:', error);
        setError(error instanceof Error ? error : new Error('Failed to load exercises'));
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, []);

  if (loading) {
    return <div 
      data-testid="loading-skeleton" 
      className={`${className} w-full h-12 bg-muted rounded-md animate-pulse`} 
    />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">Error loading exercises: {error.message}</p>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">No exercises found. Log some workouts first.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label htmlFor="exercise-select" className="sr-only">
        Select Exercise
      </label>
      <select
        id="exercise-select"
        className={`${className} w-full rounded-md border border-input bg-background px-3 py-2 sm:py-3 text-sm sm:text-base`}
        value={initialExercise}
        onChange={(e) => onExerciseChange(e.target.value)}
      >
        {exercises.map((exercise) => (
          <option key={exercise} value={exercise}>
            {exercise}
          </option>
        ))}
      </select>
    </div>
  );
}
