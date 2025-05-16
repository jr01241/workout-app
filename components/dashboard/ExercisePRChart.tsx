'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@tremor/react';
import { PRChartData } from '@/lib/types';

interface ExercisePRChartProps {
  data: PRChartData[];
  exerciseName: string;
  className?: string;
}

export function ExercisePRChart({ data, exerciseName, className }: ExercisePRChartProps) {
  if (!exerciseName) {
    return (
      <div className={className || "h-[300px] sm:h-[400px] bg-muted rounded-md animate-pulse"} />
    );
  }

  if (!data) {
    return (
      <div className={className || "h-[300px] sm:h-[400px] bg-muted rounded-md animate-pulse"} />
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{exerciseName} PR Progression</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <p className="text-muted-foreground">No PR data available for this exercise.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{exerciseName} PR Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          className={className || "h-[300px] sm:h-[400px] lg:h-[500px]"}
          data={data}
          index="date"
          categories={['prValue']}
          colors={['blue']}
          yAxisWidth={60}
          valueFormatter={(value) => `${value.toFixed(1)} kg`}
        />
      </CardContent>
    </Card>
  );
}
