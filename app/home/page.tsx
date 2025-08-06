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
    
    const today = new Date().toISOString().split('T')[0];
    
    // Handle demo user - load from localStorage
    if (user.id === 'demo-user') {
      // Load saved metrics from localStorage
      const savedMetrics = localStorage.getItem(`demo_metrics_${today}`);
      if (savedMetrics) {
        const metrics = JSON.parse(savedMetrics);
        setTodayMetrics(metrics);
      } else {
        // No data for today yet
        setTodayMetrics({});
      }
      return;
    }

    // Handle real users - load from database
    try {
      const { data } = await supabase
        .from('metrics')
        .select('reaction_ms, mood_score')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      
      if (data) {
        setTodayMetrics(data);
      } else {
        setTodayMetrics({});
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
      setTodayMetrics({});
    }
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
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '20px',
                  textAlign: 'left',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)'
                  }}>
                    <span style={{color: 'white', fontSize: '24px'}}>⚡</span>
                  </div>
                  <div>
                    <h3 style={{fontWeight: '600', color: '#111827', margin: '0 0 4px 0', fontSize: '16px'}}>Reaction Test</h3>
                    <p style={{fontSize: '14px', color: '#6b7280', margin: '0'}}>Measure response speed</p>
                  </div>
                </div>
                <div style={{fontSize: '14px', color: '#3b82f6', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  Start Test
                  <span style={{fontSize: '12px'}}>→</span>
                </div>
              </button>

              <button
                onClick={() => router.push('/alertness' as any)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '20px',
                  textAlign: 'left',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)'
                  }}>
                    <span style={{color: 'white', fontSize: '24px'}}>🧠</span>
                  </div>
                  <div>
                    <h3 style={{fontWeight: '600', color: '#111827', margin: '0 0 4px 0', fontSize: '16px'}}>Alertness Check</h3>
                    <p style={{fontSize: '14px', color: '#6b7280', margin: '0'}}>Rate your energy level</p>
                  </div>
                </div>
                <div style={{fontSize: '14px', color: '#10b981', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  Rate Now
                  <span style={{fontSize: '12px'}}>→</span>
                </div>
              </button>

              <button
                onClick={() => router.push('/sunrise-plan' as any)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '20px',
                  textAlign: 'left',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.25)'
                  }}>
                    <span style={{color: 'white', fontSize: '24px'}}>☀️</span>
                  </div>
                  <div>
                    <h3 style={{fontWeight: '600', color: '#111827', margin: '0 0 4px 0', fontSize: '16px'}}>Plan Tomorrow</h3>
                    <p style={{fontSize: '14px', color: '#6b7280', margin: '0'}}>Optimize wake sequence</p>
                  </div>
                </div>
                <div style={{fontSize: '14px', color: '#f59e0b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  Plan Now
                  <span style={{fontSize: '12px'}}>→</span>
                </div>
              </button>

              <button
                onClick={() => router.push('/trends' as any)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '20px',
                  textAlign: 'left',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.25)'
                  }}>
                    <span style={{color: 'white', fontSize: '24px'}}>📊</span>
                  </div>
                  <div>
                    <h3 style={{fontWeight: '600', color: '#111827', margin: '0 0 4px 0', fontSize: '16px'}}>View Trends</h3>
                    <p style={{fontSize: '14px', color: '#6b7280', margin: '0'}}>Analyze performance</p>
                  </div>
                </div>
                <div style={{fontSize: '14px', color: '#8b5cf6', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  View Charts
                  <span style={{fontSize: '12px'}}>→</span>
                </div>
              </button>
            </div>
          </div>

          {/* Today's Summary */}
          <div style={{flex: '1', minWidth: '320px'}}>
            <h2 style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px'}}>Today's Summary</h2>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              padding: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            }}>
              <div style={{textAlign: 'center', marginBottom: '24px'}}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.15)'
                }}>
                  <span style={{color: '#3b82f6', fontSize: '28px'}}>📈</span>
                </div>
                <h3 style={{fontWeight: '600', color: '#111827', marginBottom: '8px', fontSize: '16px'}}>Performance Status</h3>
                <p style={{fontSize: '14px', color: '#6b7280'}}>
                  {(todayMetrics.reaction_ms && todayMetrics.mood_score) 
                    ? 'All assessments complete!' 
                    : 'Some assessments pending'
                  }
                </p>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{color: '#3b82f6', fontSize: '16px'}}>⚡</span>
                    </div>
                    <span style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>Reaction Test</span>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: todayMetrics.reaction_ms ? '#dcfce7' : '#f3f4f6',
                    color: todayMetrics.reaction_ms ? '#166534' : '#6b7280'
                  }}>
                    {todayMetrics.reaction_ms ? 'Complete' : 'Pending'}
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{color: '#16a34a', fontSize: '16px'}}>🧠</span>
                    </div>
                    <span style={{fontSize: '14px', fontWeight: '500', color: '#111827'}}>Alertness Check</span>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: todayMetrics.mood_score ? '#dcfce7' : '#f3f4f6',
                    color: todayMetrics.mood_score ? '#166534' : '#6b7280'
                  }}>
                    {todayMetrics.mood_score ? 'Complete' : 'Pending'}
                  </div>
                </div>
              </div>

              <div style={{marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f3f4f6'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <span style={{fontSize: '14px', fontWeight: '500', color: '#374151'}}>Daily Progress</span>
                  <span style={{fontSize: '14px', fontWeight: '600', color: '#111827'}}>
                    {Math.round(((todayMetrics.reaction_ms ? 1 : 0) + (todayMetrics.mood_score ? 1 : 0)) / 2 * 100)}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '10px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                    height: '100%',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    width: `${((todayMetrics.reaction_ms ? 1 : 0) + (todayMetrics.mood_score ? 1 : 0)) * 50}%`
                  }}></div>
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