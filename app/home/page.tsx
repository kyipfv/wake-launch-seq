'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

interface HealthCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  value?: string;
  unit?: string;
  subtitle?: string;
  route: string;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [todayMetrics, setTodayMetrics] = useState<any>({});
  const [userName, setUserName] = useState('');

  useEffect(() => {
    console.log('Home page useEffect - user:', user?.id, 'pathname:', window.location.pathname);
    if (user) {
      console.log('User found on home page, loading data...');
      loadUserData();
      loadTodayMetrics();
    }
  }, [user, router]);

  const loadUserData = async () => {
    if (!user) return;
    // Use email directly from auth session instead of querying database
    if (user.email) {
      setUserName(user.email.split('@')[0]);
    } else {
      setUserName('Demo');
    }
  };

  const loadTodayMetrics = async () => {
    if (!user) return;
    // For demo purposes, set some mock data
    setTodayMetrics({
      reaction_ms: 245,
      mood_score: 8
    });
  };

  const allCards = [
    {
      id: 'reaction',
      title: 'Reaction Time',
      icon: '⚡',
      color: 'bg-blue-500',
      description: `Neural response speed. ${todayMetrics.reaction_ms ? `${todayMetrics.reaction_ms}ms` : 'No data recorded'} today with cognitive optimization tracking`,
      team: todayMetrics.reaction_ms ? `Current: ${todayMetrics.reaction_ms}ms` : 'No data',
      metric: todayMetrics.reaction_ms ? `${todayMetrics.reaction_ms}ms AVG` : 'No data',
      route: '/reaction-test'
    },
    {
      id: 'alertness',
      title: 'Alertness Level',
      icon: '🧠',
      color: 'bg-green-500',
      description: `Cognitive performance tracking. ${todayMetrics.mood_score ? `${todayMetrics.mood_score}/10` : 'No rating recorded'} today with neural enhancement monitoring`,
      team: todayMetrics.mood_score ? `Current: ${todayMetrics.mood_score}/10` : 'No data',
      metric: todayMetrics.mood_score ? `${todayMetrics.mood_score}/10 SCORE` : 'No data',
      route: '/alertness'
    },
    {
      id: 'sunrise',
      title: 'Sunrise Plan',
      icon: '☀️',
      color: 'bg-orange-500',
      description: 'Circadian rhythm optimization. Plan tomorrow\'s wake sequence with personalized light exposure timing',
      team: 'Schedule: Tomorrow',
      metric: 'OPTIMIZER',
      route: '/sunrise-plan'
    },
    {
      id: 'trends',
      title: 'Performance Trends',
      icon: '📊',
      color: 'bg-purple-500',
      description: 'Long-term cognitive analytics. Track performance patterns over 14 days with trend analysis',
      team: 'Period: 14 days',
      metric: 'ANALYTICS',
      route: '/trends'
    },
    {
      id: 'chronotype',
      title: 'Chronotype Profile',
      icon: '🌙',
      color: 'bg-indigo-500',
      description: 'Personal circadian assessment. Determine your optimal sleep-wake cycle based on behavioral patterns',
      team: 'Status: Complete',
      metric: 'PROFILE',
      route: '/chronotype'
    },
    {
      id: 'settings',
      title: 'Configuration',
      icon: '⚙️',
      color: 'bg-gray-500',
      description: 'System preferences and location settings. Configure app behavior and personal optimization parameters',
      team: 'Access: Available',
      metric: 'SETTINGS',
      route: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">{userName || 'User'}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userName ? userName[0].toUpperCase() : 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 24px'}}>
        {/* Key Metrics Row */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px'}}>
          <div style={{backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px'}}>Reaction Time</p>
                <p style={{fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '4px'}}>
                  {todayMetrics.reaction_ms ? `${todayMetrics.reaction_ms}ms` : '—'}
                </p>
                <p style={{fontSize: '14px', color: '#6b7280'}}>Today's average</p>
              </div>
              <div style={{width: '48px', height: '48px', backgroundColor: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{color: '#2563eb', fontSize: '20px'}}>⚡</span>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px'}}>Alertness Level</p>
                <p style={{fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '4px'}}>
                  {todayMetrics.mood_score ? `${todayMetrics.mood_score}/10` : '—'}
                </p>
                <p style={{fontSize: '14px', color: '#6b7280'}}>Current rating</p>
              </div>
              <div style={{width: '48px', height: '48px', backgroundColor: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{color: '#16a34a', fontSize: '20px'}}>🧠</span>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px'}}>Tests Completed</p>
                <p style={{fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '4px'}}>
                  {(todayMetrics.reaction_ms ? 1 : 0) + (todayMetrics.mood_score ? 1 : 0)}/2
                </p>
                <p style={{fontSize: '14px', color: '#6b7280'}}>Today's progress</p>
              </div>
              <div style={{width: '48px', height: '48px', backgroundColor: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{color: '#9333ea', fontSize: '20px'}}>📊</span>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px'}}>Streak</p>
                <p style={{fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '4px'}}>7 days</p>
                <p style={{fontSize: '14px', color: '#6b7280'}}>Current streak</p>
              </div>
              <div style={{width: '48px', height: '48px', backgroundColor: '#fed7aa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{color: '#ea580c', fontSize: '20px'}}>🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{display: 'flex', gap: '32px', flexDirection: 'row', flexWrap: 'wrap'}}>
          {/* Quick Actions */}
          <div style={{flex: '2', minWidth: '300px'}}>
            <h2 style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px'}}>Quick Actions</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
              <button
                onClick={() => router.push('/reaction-test' as any)}
                className="bg-white rounded-lg border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reaction Test</h3>
                    <p className="text-sm text-gray-600">Measure response speed</p>
                  </div>
                </div>
                <div className="text-sm text-blue-600 font-medium">Start Test →</div>
              </button>

              <button
                onClick={() => router.push('/alertness' as any)}
                className="bg-white rounded-lg border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🧠</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Alertness Check</h3>
                    <p className="text-sm text-gray-600">Rate your energy level</p>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium">Rate Now →</div>
              </button>

              <button
                onClick={() => router.push('/sunrise-plan' as any)}
                className="bg-white rounded-lg border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">☀️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Plan Tomorrow</h3>
                    <p className="text-sm text-gray-600">Optimize wake sequence</p>
                  </div>
                </div>
                <div className="text-sm text-orange-600 font-medium">Plan Now →</div>
              </button>

              <button
                onClick={() => router.push('/trends' as any)}
                className="bg-white rounded-lg border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">View Trends</h3>
                    <p className="text-sm text-gray-600">Analyze performance</p>
                  </div>
                </div>
                <div className="text-sm text-purple-600 font-medium">View Charts →</div>
              </button>
            </div>
          </div>

          {/* Today's Summary */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">📈</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Performance Status</h3>
                <p className="text-sm text-gray-600">
                  {(todayMetrics.reaction_ms && todayMetrics.mood_score) 
                    ? 'All assessments complete!' 
                    : 'Some assessments pending'
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">⚡</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Reaction Test</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    todayMetrics.reaction_ms 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {todayMetrics.reaction_ms ? 'Complete' : 'Pending'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-sm">🧠</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Alertness Check</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    todayMetrics.mood_score 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {todayMetrics.mood_score ? 'Complete' : 'Pending'}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Daily Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(((todayMetrics.reaction_ms ? 1 : 0) + (todayMetrics.mood_score ? 1 : 0)) / 2 * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((todayMetrics.reaction_ms ? 1 : 0) + (todayMetrics.mood_score ? 1 : 0)) * 50}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}