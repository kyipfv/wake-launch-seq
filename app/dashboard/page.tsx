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
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Nav />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-header">Summary</h1>
          <p className="section-subheader">
            {hasCompletedToday 
              ? "Today's metrics have been logged. Review your performance trends below." 
              : "Complete your daily assessments to track your wake performance."
            }
          </p>
        </div>

        {/* Today's Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Reaction Time Card */}
          <div className="health-card">
            <div className="text-center">
              <div className="health-metric-label mb-1">Reaction Time</div>
              <div className="health-metric-value">
                {todayMetrics.reaction_ms ? todayMetrics.reaction_ms : '—'}
              </div>
              <div className="health-metric-unit">
                {todayMetrics.reaction_ms ? 'ms' : 'No data'}
              </div>
            </div>
          </div>

          {/* Alertness Card */}
          <div className="health-card">
            <div className="text-center">
              <div className="health-metric-label mb-1">Alertness</div>
              <div className="health-metric-value">
                {todayMetrics.mood_score ? todayMetrics.mood_score : '—'}
              </div>
              <div className="health-metric-unit">
                {todayMetrics.mood_score ? '/10' : 'No data'}
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="health-card">
            <div className="text-center">
              <div className="health-metric-label mb-1">Status</div>
              <div className="text-sm font-medium mt-2">
                {hasCompletedToday ? (
                  <span className="text-green-500 flex items-center justify-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Complete
                  </span>
                ) : (
                  <span className="text-orange-500 flex items-center justify-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11M11,9H13V7H11"/>
                    </svg>
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="health-card">
            <div className="text-center">
              <div className="health-metric-label mb-3">Quick Start</div>
              <div className="space-y-2">
                <button 
                  onClick={() => document.getElementById('reaction-test')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full text-xs py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Test
                </button>
                <button 
                  onClick={() => document.getElementById('mood-slider')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full text-xs py-2 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Log
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Plan - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <PlanCard />
          </div>

          {/* Assessment Tools */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Daily Assessments
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={() => document.getElementById('reaction-test')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full text-left health-card hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                              fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Reaction Test</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Measure response time</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => document.getElementById('mood-slider')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full text-left health-card hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
                              fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Alertness Check</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rate your energy level</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => document.getElementById('charts')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full text-left health-card hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" 
                              fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Performance Trends</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>View 14-day analysis</div>
                    </div>
                  </div>
                </button>
              </div>
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