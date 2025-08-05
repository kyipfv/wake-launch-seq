'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import Nav from '@/components/Nav';
import ReactionTest from '@/components/ReactionTest';
import MoodSlider from '@/components/MoodSlider';
import PlanCard from '@/components/PlanCard';
import ChartPanel from '@/components/ChartPanel';
import ProgressRing from '@/components/ProgressRing';

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
      
      {/* Hero Dashboard Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="apple-eyebrow mb-4">Dashboard</div>
          <h1 className="apple-large-text mb-6">
            Your Performance Today
          </h1>
          <p className="apple-body-large mb-12">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </section>

      {/* Performance Metrics - Apple Style */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Reaction Speed Card */}
            <div className="apple-card text-center">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl">
                  <div className="text-6xl">⚡</div>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {todayMetrics.reaction_ms || '—'}
                  {todayMetrics.reaction_ms && <span className="text-2xl text-gray-600">ms</span>}
                </div>
                <div className="text-xl text-gray-600 mb-6">Reaction Speed</div>
                {!todayMetrics.reaction_ms && (
                  <button 
                    onClick={() => document.getElementById('reaction-test')?.scrollIntoView({ behavior: 'smooth' })}
                    className="apple-button apple-button-primary"
                  >
                    Take Test
                  </button>
                )}
              </div>
            </div>

            {/* Alertness Card */}
            <div className="apple-card text-center">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl">
                  <div className="text-6xl">😊</div>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {todayMetrics.mood_score || '—'}
                  {todayMetrics.mood_score && <span className="text-2xl text-gray-600">/10</span>}
                </div>
                <div className="text-xl text-gray-600 mb-6">Alertness Level</div>
                {!todayMetrics.mood_score && (
                  <button 
                    onClick={() => document.getElementById('mood-slider')?.scrollIntoView({ behavior: 'smooth' })}
                    className="apple-button apple-button-primary"
                  >
                    Log Mood
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {hasCompletedToday ? (
            <div>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl">
                <div className="text-4xl">✅</div>
              </div>
              <h2 className="apple-medium-text mb-4">Assessment Complete!</h2>
              <p className="apple-body-large text-gray-600">
                Your performance metrics have been logged for today.
              </p>
            </div>
          ) : (
            <div>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-2xl">
                <div className="text-4xl">⏳</div>
              </div>
              <h2 className="apple-medium-text mb-4">Complete Your Assessment</h2>
              <p className="apple-body-large text-gray-600 mb-8">
                Track your wake performance by completing both tests below.
              </p>
            </div>
          )}
        </div>
      </section>

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