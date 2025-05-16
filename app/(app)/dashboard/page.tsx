'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import chart components with loading states
const ExercisePRChart = dynamic(
  () => import('@/components/dashboard/ExercisePRChart').then(mod => mod.ExercisePRChart),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[300px] sm:h-[400px] bg-muted rounded-md animate-pulse" />
    )
  }
);

const WeeklyVolumeChart = dynamic(
  () => import('@/components/dashboard/WeeklyVolumeChart').then(mod => mod.WeeklyVolumeChart),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[300px] sm:h-[400px] bg-muted rounded-md animate-pulse" />
    )
  }
);

const ExerciseSelector = dynamic(
  () => import('@/components/dashboard/ExerciseSelector').then(mod => mod.ExerciseSelector),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-12 bg-muted rounded-md animate-pulse" />
    )
  }
);

import { getExercisePRData, getWeeklyVolumeData, getExercisesList } from '@/lib/actions/dashboard.actions';
import { PRChartData, VolumeChartData } from '@/lib/types';

export default function DashboardPage() {
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [prData, setPrData] = useState<PRChartData[]>([]);
  const [volumeData, setVolumeData] = useState<VolumeChartData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError(null);
        // Get list of exercises
        const exercises = await getExercisesList({ userId: undefined });
        
        // Set initial selected exercise if available
        if (exercises.length > 0) {
          setSelectedExercise(exercises[0]);
          
          // Load PR data for the first exercise
          const prData = await getExercisePRData({ exerciseName: exercises[0], userId: undefined });
          setPrData(prData);
        }
        
        // Load volume data
        const volumeData = await getWeeklyVolumeData();
        setVolumeData(volumeData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError(error instanceof Error ? error : new Error('Failed to load dashboard data'));
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Progress Dashboard</h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">PR Progression</h3>
              <div className="w-full h-[300px] sm:h-[400px] bg-muted rounded-md animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Weekly Volume</h3>
              <div className="w-full h-[300px] sm:h-[400px] bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Progress Dashboard</h2>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700">Error loading exercises: {error.message}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">PR Progression</h3>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700">Error loading PR data: {error.message}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Weekly Volume</h3>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700">Error loading volume data: {error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Progress Dashboard</h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">PR Progression</h3>
              <div className="w-full h-[300px] sm:h-[400px] bg-muted rounded-md animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Weekly Volume</h3>
              <div className="w-full h-[300px] sm:h-[400px] bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle exercise change
  async function handleExerciseChange(exercise: string) {
    setSelectedExercise(exercise);
    setPrData([]);
    setError(null);
    try {
      const prData = await getExercisePRData({ exerciseName: exercise, userId: undefined });
      setPrData(prData);
    } catch (error) {
      console.error('Error loading PR data:', error);
      setError(error instanceof Error ? error : new Error('Failed to load PR data'));
      setPrData([]);
    }
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">Progress Dashboard</h2>
        
        {selectedExercise && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <ExerciseSelector 
              initialExercise={selectedExercise} 
              onExerciseChange={handleExerciseChange} 
              className="w-full sm:w-auto"
            />
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-medium">PR Progression</h3>
            {selectedExercise ? (
              <div className="w-full">
                <ExercisePRChart 
                  data={prData} 
                  exerciseName={selectedExercise} 
                  className="h-[300px] sm:h-[400px] lg:h-[500px]"
                />
              </div>
            ) : (
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-muted rounded-md animate-pulse" />
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-medium">Weekly Volume</h3>
            {volumeData ? (
              <div className="w-full">
                <WeeklyVolumeChart 
                  data={volumeData} 
                  className="h-[300px] sm:h-[400px] lg:h-[500px]"
                />
              </div>
            ) : (
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-muted rounded-md animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
