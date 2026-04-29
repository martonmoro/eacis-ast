/**
 * EngagementChart Component
 * Displays real-time engagement score over time using Recharts
 */

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  timestamp: number;
  engagement: number;
  label: string;
}

const EngagementTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { time: string; label: string; engagementPercent: number } }> }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-gray-900">{d.time}</p>
        <p className="text-gray-500">
          Level: <span className="font-medium text-gray-800">{d.label}</span>
        </p>
        <p className="text-blue-600 font-semibold">{d.engagementPercent.toFixed(0)}% engaged</p>
      </div>
    );
  }
  return null;
};

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
          <h2 className="text-xl font-bold text-gray-900">Engagement Over Time</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {data.length} data point{data.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-xl p-3 space-y-0.5">
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Current</p>
            <p className="text-2xl font-bold text-blue-700">{stats.current}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 space-y-0.5">
            <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">Average</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.average}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 space-y-0.5">
            <p className="text-xs text-red-400 font-medium uppercase tracking-wide">Min</p>
            <p className="text-2xl font-bold text-red-600">{stats.min}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 space-y-0.5">
            <p className="text-xs text-purple-400 font-medium uppercase tracking-wide">Max</p>
            <p className="text-2xl font-bold text-purple-700">{stats.max}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-72">
          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm">No data yet — start the camera to begin tracking.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: 'Engagement (%)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#9ca3af', fontSize: 11 },
                  }}
                />
                <Tooltip content={<EngagementTooltip />} />
                <Area
                  type="monotone"
                  dataKey="engagementPercent"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#engagementGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#3b82f6' }}
                  name="Engagement %"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
};
