/**
 * EngagementChart Component
 * Displays real-time engagement score over time using Recharts
 */

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataPoint {
  timestamp: number;
  engagement: number;
  label: string;
}

interface EngagementChartProps {
  data: DataPoint[];
  maxDataPoints?: number;
}

export const EngagementChart: React.FC<EngagementChartProps> = ({
  data,
  maxDataPoints = 50,
}) => {
  // Limit data points to prevent performance issues
  const chartData = useMemo(() => {
    const limitedData = data.slice(-maxDataPoints);
    return limitedData.map((point) => ({
      ...point,
      time: new Date(point.timestamp * 1000).toLocaleTimeString(),
      engagementPercent: point.engagement * 100,
    }));
  }, [data, maxDataPoints]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (data.length === 0) {
      return { average: 0, min: 0, max: 0, current: 0 };
    }

    const engagementValues = data.map((d) => d.engagement);
    const sum = engagementValues.reduce((acc, val) => acc + val, 0);
    const average = sum / engagementValues.length;
    const min = Math.min(...engagementValues);
    const max = Math.max(...engagementValues);
    const current = engagementValues[engagementValues.length - 1];

    return {
      average: average.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      current: current.toFixed(2),
    };
  }, [data]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Engagement Over Time</h2>
          <span className="text-sm text-gray-500">
            {data.length} data points
          </span>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Current</p>
            <p className="text-2xl font-bold text-blue-600">{stats.current}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-2xl font-bold text-green-600">{stats.average}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Min</p>
            <p className="text-2xl font-bold text-red-600">{stats.min}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Max</p>
            <p className="text-2xl font-bold text-purple-600">{stats.max}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No data available yet. Start the camera to begin tracking.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: 'Engagement (%)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-semibold">{data.time}</p>
                          <p className="text-sm">
                            Emotion:{' '}
                            <span className="font-medium">{data.emotion}</span>
                          </p>
                          <p className="text-sm">
                            Engagement:{' '}
                            <span className="font-medium">
                              {data.engagementPercent.toFixed(0)}%
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="engagementPercent"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Engagement %"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
};
