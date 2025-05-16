'use server';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { PRChartData, VolumeChartData } from '@/lib/types';
import { getCachedData, setCachedData } from '@/lib/cache';

// Get PR progression data for a specific exercise
export async function getExercisePRData(params: { exerciseName: string; userId?: string }): Promise<PRChartData[]> {
  const cacheKey = `exercise-pr:${params.exerciseName}:${params.userId || 'all'}`;
  const cachedData = await getCachedData<PRChartData[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const exercises = await prisma.exercise.findMany({
      where: {
        ...(params.userId && { workout: { userId: params.userId } }),
        name: params.exerciseName
      },
      include: {
        sets: {
          select: {
            weight: true,
            reps: true,
            date: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const prData: PRChartData[] = [];
    let maxWeight = 0;

    for (const exercise of exercises) {
      for (const set of exercise.sets) {
        if (set.weight > maxWeight) {
          maxWeight = set.weight;
          prData.push({
            date: set.date,
            prValue: maxWeight
          });
        }
      }
    }

    await setCachedData(cacheKey, prData, 60 * 5); // Cache for 5 minutes
    return prData;
  } catch (error) {
    console.error('Error fetching PR data:', error);
    throw new Error('Failed to fetch PR data');
  }
}

// Get weekly training volume data
export async function getWeeklyVolumeData(params?: { userId?: string }): Promise<VolumeChartData[]> {
  const cacheKey = `weekly-volume:${params?.userId || 'all'}`;
  const cachedData = await getCachedData<VolumeChartData[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const exercises = await prisma.exercise.findMany({
      where: params?.userId ? { workout: { userId: params.userId } } : {},
      include: {
        sets: {
          select: {
            weight: true,
            reps: true,
            date: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const volumeData: VolumeChartData[] = [];
    const weeklyVolumes: { [key: string]: number } = {};

    for (const exercise of exercises) {
      const weekStartDate = new Date(exercise.date);
      weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay()); // Set to Monday
      const weekKey = weekStartDate.toISOString().split('T')[0];

      let workoutVolume = 0;
      for (const set of exercise.sets) {
        workoutVolume += set.weight * set.reps;
      }

      weeklyVolumes[weekKey] = (weeklyVolumes[weekKey] || 0) + workoutVolume;
    }

    Object.entries(weeklyVolumes).forEach(([date, volume]) => {
      volumeData.push({
        weekStartDate: date,
        totalVolume: volume
      });
    });

    await setCachedData(cacheKey, volumeData, 60 * 5); // Cache for 5 minutes
    return volumeData;
  } catch (error) {
    console.error('Error fetching volume data:', error);
    throw new Error('Failed to fetch volume data');
  }
}

// Get list of exercises for selection
export async function getExercisesList(params: { userId?: string }): Promise<string[]> {
  const cacheKey = `exercises-list:${params.userId || 'all'}`;
  const cachedData = await getCachedData<string[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const exercises = await prisma.exercise.findMany({
      where: params.userId ? { workout: { userId: params.userId } } : {},
      select: { name: true },
      distinct: ['name'],
      orderBy: { name: 'asc' }
    });

    const result = exercises.map(e => e.name);
    await setCachedData(cacheKey, result, 60 * 5); // Cache for 5 minutes
    return result;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw new Error('Failed to fetch exercises list');
  }
}
