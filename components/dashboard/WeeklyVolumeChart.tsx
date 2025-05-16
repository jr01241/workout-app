'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@tremor/react';
import { VolumeChartData } from '@/lib/types';

interface WeeklyVolumeChartProps {
  data: VolumeChartData[];
  className?: string;
}

export function WeeklyVolumeChart({ data, className }: WeeklyVolumeChartProps) {
  if (!data) {
    return (
      <div className={className || "h-[300px] sm:h-[400px] bg-muted rounded-md animate-pulse"} />
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Volume Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No workouts have been logged yet. Start tracking your workouts to see your progress!
          </div>
          <p className="text-muted-foreground">No volume data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Training Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          className={className || "h-[300px] sm:h-[400px] lg:h-[500px]"}
          data={data}
          index="weekStartDate"
          categories={['totalVolume']}
          colors={['indigo']}
          yAxisWidth={60}
          valueFormatter={(value) => `${value.toLocaleString()} kg`}
        />
      </CardContent>
    </Card>
  );
}
