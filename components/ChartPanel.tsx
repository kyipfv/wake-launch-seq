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
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
          <p className="text-gray-900 font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-semibold" style={{ color: entry.color }}>
              {entry.dataKey === 'reactionTime' ? '⚡ Reaction Time: ' : '🧠 Mood: '}
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
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded-2xl w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const hasData = data.some(d => d.reactionTime || d.mood);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-lg">📈</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Performance Metrics</h3>
        </div>
        {streak >= 5 && (
          <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-2xl px-4 py-2">
            <span className="text-orange-600 font-bold text-sm">
              🔥 {streak} day streak!
            </span>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="text-center py-16 relative z-10">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">📈</span>
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">No performance data yet</p>
          <p className="text-base text-gray-500 font-medium">Complete your daily tests to see trends</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 300 }} className="relative z-10">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="displayDate" 
                stroke="#6B7280"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                yAxisId="left"
                stroke="#6B7280"
                fontSize={12}
                fontWeight={500}
                domain={[0, 'dataMax + 50']}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                fontSize={12}
                fontWeight={500}
                domain={[0, 10]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontWeight: 600 }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="reactionTime"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 3, r: 5 }}
                connectNulls={false}
                name="⚡ Reaction Time (ms)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="mood"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 3, r: 5 }}
                connectNulls={false}
                name="🧠 Mood (0-10)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}