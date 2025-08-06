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
      let metrics: MetricData[] = [];

      // Handle demo user - load from localStorage
      if (user.id === 'demo-user') {
        // Collect metrics from localStorage for the last 14 days
        for (let i = 13; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const savedMetrics = localStorage.getItem(`demo_metrics_${dateStr}`);
          if (savedMetrics) {
            const dayMetrics = JSON.parse(savedMetrics);
            metrics.push({
              date: dateStr,
              reaction_ms: dayMetrics.reaction_ms,
              mood_score: dayMetrics.mood_score
            });
          }
        }
        
        // Add some sample historical data for demonstration if no data exists
        if (metrics.length === 0) {
          // Generate sample data for the last 7 days
          for (let i = 7; i >= 1; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Generate realistic sample data with some variation
            const baseReaction = 250 + (Math.random() - 0.5) * 60; // 220-280ms range
            const baseMood = 6.5 + (Math.random() - 0.5) * 3; // 5-8 range
            
            metrics.push({
              date: dateStr,
              reaction_ms: Math.round(baseReaction),
              mood_score: Math.round(baseMood * 10) / 10
            });
          }
        }
      } else {
        // Handle real users - load from database
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const startDate = fourteenDaysAgo.toISOString().split('T')[0];

        const { data: dbMetrics, error } = await supabase
          .from('metrics')
          .select('date, reaction_ms, mood_score')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .order('date', { ascending: true });

        if (error) {
          console.error('Error loading metrics:', error);
          return;
        }

        metrics = dbMetrics || [];
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
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{color: '#111827', fontWeight: '700', marginBottom: '8px'}}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{fontWeight: '600', color: entry.color}}>
              {entry.dataKey === 'reactionTime' ? '⚡ Reaction Time: ' : '🧠 Alertness: '}
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
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #f3f4f6'
      }}>
        <div>
          <div style={{
            height: '24px',
            backgroundColor: '#e5e7eb',
            borderRadius: '12px',
            width: '33%',
            marginBottom: '24px',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}></div>
          <div style={{
            height: '256px',
            backgroundColor: '#e5e7eb',
            borderRadius: '12px',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}></div>
        </div>
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  const hasData = data.some(d => d.reactionTime || d.mood);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid #f3f4f6',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '80px',
        height: '80px',
        backgroundColor: '#8b5cf6',
        opacity: '0.05',
        borderRadius: '50%',
        transform: 'translate(16px, -16px)'
      }}></div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        position: 'relative',
        zIndex: '10'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{fontSize: '18px'}}>📈</span>
          </div>
          <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>Performance Metrics</h3>
        </div>
        {streak >= 2 && (
          <div style={{
            background: 'linear-gradient(135deg, #fed7aa 0%, #fbbf24 100%)',
            border: '1px solid #fdba74',
            borderRadius: '12px',
            padding: '8px 16px'
          }}>
            <span style={{color: '#ea580c', fontWeight: '700', fontSize: '14px'}}>
              🔥 {streak} day streak!
            </span>
          </div>
        )}
      </div>

      {!hasData ? (
        <div style={{textAlign: 'center', padding: '64px 0', position: 'relative', zIndex: '10'}}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#f3f4f6',
            borderRadius: '16px',
            margin: '0 auto 24px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{fontSize: '32px'}}>📈</span>
          </div>
          <p style={{fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>No performance data yet</p>
          <p style={{fontSize: '16px', color: '#6b7280', fontWeight: '500'}}>Complete your daily tests to see trends</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 300, position: 'relative', zIndex: '10' }}>
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
                name="🧠 Alertness (0-10)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}