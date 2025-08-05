'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface MetricData {
  date: string;
  reaction_ms?: number;
  mood_score?: number;
}

interface ChartData {
  date: string;
  displayDate: string;
  reactionTime?: number;
  mood?: number;
}

export default function ChartPanel() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMetrics();
    }
  }, [user]);

  const loadMetrics = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      const startDate = fourteenDaysAgo.toISOString().split('T')[0];

      const { data: metrics, error } = await supabase
        .from('metrics')
        .select('date, reaction_ms, mood_score')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading metrics:', error);
        return;
      }

      // Create array of last 14 days
      const chartData: ChartData[] = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayMetrics = metrics?.find(m => m.date === dateStr);
        
        chartData.push({
          date: dateStr,
          displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          reactionTime: dayMetrics?.reaction_ms || undefined,
          mood: dayMetrics?.mood_score || undefined,
        });
      }

      setData(chartData);
      calculateStreak(metrics || []);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (metrics: MetricData[]) => {
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasData = metrics.some((m: any) => 
        m.date === dateStr && (m.reaction_ms || m.mood_score)
      );
      
      if (hasData) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'reactionTime' ? 'Reaction Time: ' : 'Mood: '}
              {entry.value}
              {entry.dataKey === 'reactionTime' ? 'ms' : '/10'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const hasData = data.some(d => d.reactionTime || d.mood);

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
        {streak >= 5 && (
          <div className="bg-primary/20 border border-primary/50 rounded-lg px-3 py-1">
            <span className="text-primary font-semibold text-sm">
              🔥 {streak} day streak!
            </span>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-gray-400 mb-2">No performance data yet</p>
          <p className="text-gray-500 text-sm">Complete your daily tests to see trends</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="displayDate" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#9CA3AF"
                fontSize={12}
                domain={[0, 'dataMax + 50']}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#9CA3AF"
                fontSize={12}
                domain={[0, 10]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="reactionTime"
                stroke="#00BFFF"
                strokeWidth={2}
                dot={{ fill: '#00BFFF', strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Reaction Time (ms)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="mood"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Mood (0-10)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}