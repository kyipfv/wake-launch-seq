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
import MoodTracker from '@/components/MoodTracker';

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

      {/* Mood Tracker Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <MoodTracker />
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

      {/* Assessment Tools Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="apple-eyebrow mb-4">Daily Assessments</div>
            <h2 className="apple-medium-text mb-6">
              Track your performance metrics
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div id="reaction-test">
              <ReactionTest onComplete={handleMetricUpdate} />
            </div>
            
            <div id="mood-slider">
              <MoodSlider onSave={handleMetricUpdate} />
            </div>
          </div>
        </div>
      </section>

      {/* Performance Chart Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="apple-eyebrow mb-4">Analytics</div>
            <h2 className="apple-medium-text mb-6">
              14-day performance trends
            </h2>
          </div>
          
          <div id="charts">
            <ChartPanel />
          </div>
        </div>
      </section>

      {/* Today's Plan Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <PlanCard />
        </div>
      </section>
    </div>
  );
}