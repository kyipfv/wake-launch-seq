'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import Nav from '@/components/Nav';
import ReactionTest from '@/components/ReactionTest';
import MoodSlider from '@/components/MoodSlider';
import PlanCard from '@/components/PlanCard';
import ChartPanel from '@/components/ChartPanel';

interface TodayMetrics {
  reaction_ms?: number;
  mood_score?: number;
}

export default function Dashboard() {
  const [todayMetrics, setTodayMetrics] = useState<TodayMetrics>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTodayMetrics();
    }
  }, [user]);

  const loadTodayMetrics = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('metrics')
      .select('reaction_ms, mood_score')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (data) {
      setTodayMetrics(data);
    }
    
    setLoading(false);
  };

  const handleMetricUpdate = () => {
    loadTodayMetrics();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasCompletedToday = todayMetrics.reaction_ms && todayMetrics.mood_score;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <Nav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
          <p className="text-gray-300">
            {hasCompletedToday 
              ? "Today's performance logged. Check your trends below." 
              : "Complete your daily assessments to track performance."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Today's Quick Stats */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Today's Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Reaction Time:</span>
                <span className="text-primary font-semibold">
                  {todayMetrics.reaction_ms ? `${todayMetrics.reaction_ms}ms` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Alertness:</span>
                <span className="text-primary font-semibold">
                  {todayMetrics.mood_score ? `${todayMetrics.mood_score}/10` : '—'}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-600">
                <div className="text-sm text-gray-400">
                  {hasCompletedToday ? (
                    <span className="text-green-400">✓ Daily assessment complete</span>
                  ) : (
                    <span className="text-yellow-400">⏳ Pending assessments</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tomorrow's Plan */}
          <PlanCard />

          {/* Quick Actions */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => document.getElementById('reaction-test')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full text-left p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                <div className="text-white font-medium">Reaction Test</div>
                <div className="text-gray-400 text-sm">Measure response time</div>
              </button>
              
              <button 
                onClick={() => document.getElementById('mood-slider')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full text-left p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                <div className="text-white font-medium">Log Alertness</div>
                <div className="text-gray-400 text-sm">Rate your energy level</div>
              </button>
              
              <button 
                onClick={() => document.getElementById('charts')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full text-left p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                <div className="text-white font-medium">View Trends</div>
                <div className="text-gray-400 text-sm">14-day performance chart</div>
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div id="reaction-test">
            <ReactionTest onComplete={handleMetricUpdate} />
          </div>
          
          <div id="mood-slider">
            <MoodSlider onSave={handleMetricUpdate} />
          </div>
        </div>

        {/* Performance Chart */}
        <div id="charts" className="mb-8">
          <ChartPanel />
        </div>
      </div>
    </div>
  );
}