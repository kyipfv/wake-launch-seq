'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import ChartPanel from '@/components/ChartPanel';
import BottomNav from '@/components/BottomNav';

export default function TrendsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [avgReaction, setAvgReaction] = useState<number | null>(null);
  const [avgAlertness, setAvgAlertness] = useState<number | null>(null);
  const [reactionTrend, setReactionTrend] = useState<number>(0);
  const [alertnessTrend, setAlertnessTrend] = useState<number>(0);
  const [actualStreak, setActualStreak] = useState<number>(0);

  useEffect(() => {
    if (user) {
      calculateAverages();
    }
  }, [user]);

  const calculateAverages = () => {
    if (!user) return;

    const today = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);
    
    let reactionSum = 0;
    let reactionCount = 0;
    let alertnessSum = 0;
    let alertnessCount = 0;
    let currentStreak = 0;
    
    // Calculate averages for last 14 days
    const allReactions: number[] = [];
    const allAlertness: number[] = [];
    
    for (let d = new Date(fourteenDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      if (user.id === 'demo-user') {
        const savedMetrics = localStorage.getItem(`demo_metrics_${dateStr}`);
        if (savedMetrics) {
          const metrics = JSON.parse(savedMetrics);
          if (metrics.reaction_ms) {
            allReactions.push(metrics.reaction_ms);
            reactionSum += metrics.reaction_ms;
            reactionCount++;
          }
          if (metrics.mood_score) {
            allAlertness.push(metrics.mood_score);
            alertnessSum += metrics.mood_score;
            alertnessCount++;
          }
        }
      }
    }
    
    // Calculate averages
    if (reactionCount > 0) {
      setAvgReaction(Math.round(reactionSum / reactionCount));
    }
    if (alertnessCount > 0) {
      setAvgAlertness(Number((alertnessSum / alertnessCount).toFixed(1)));
    }
    
    // Calculate trends (compare first half to second half)
    if (allReactions.length >= 4) {
      const midPoint = Math.floor(allReactions.length / 2);
      const firstHalf = allReactions.slice(0, midPoint);
      const secondHalf = allReactions.slice(midPoint);
      
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      // Lower reaction time is better
      const improvement = ((firstAvg - secondAvg) / firstAvg) * 100;
      setReactionTrend(Math.round(improvement));
    }
    
    if (allAlertness.length >= 4) {
      const midPoint = Math.floor(allAlertness.length / 2);
      const firstHalf = allAlertness.slice(0, midPoint);
      const secondHalf = allAlertness.slice(midPoint);
      
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      // Higher alertness is better
      const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;
      setAlertnessTrend(Math.round(improvement));
    }
    
    // Calculate streak
    let checkDate = new Date();
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const metricsKey = `demo_metrics_${dateStr}`;
      const planKey = `plan_completed_${dateStr}`;
      
      const hasMetrics = localStorage.getItem(metricsKey);
      const hasPlan = localStorage.getItem(planKey);
      
      if (hasMetrics || hasPlan) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (checkDate.toDateString() === today.toDateString()) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setActualStreak(currentStreak);
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '24px 24px 32px 24px',
        paddingTop: '64px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
            <button 
              onClick={() => router.push('/home')}
              style={{
                padding: '12px',
                marginLeft: '-12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '50%',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ArrowLeft style={{width: '24px', height: '24px', color: '#111827'}} />
            </button>
            <div>
              <h1 style={{fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0'}}>Trends</h1>
              <p style={{color: '#6b7280', fontSize: '16px', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>14-day performance analysis</p>
            </div>
          </div>
          
          {/* Icon Display */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -3px rgba(139, 92, 246, 0.3), 0 4px 6px -2px rgba(139, 92, 246, 0.05)'
            }}>
              <span style={{fontSize: '40px', color: 'white'}}>📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px 128px 24px'
      }}>
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: '1px solid #f3f4f6',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
            cursor: 'pointer'
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
            {/* Background gradient */}
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '64px',
              height: '64px',
              backgroundColor: '#3b82f6',
              opacity: '0.03',
              borderRadius: '50%',
              transform: 'translate(8px, -8px)'
            }}></div>
            
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: '10'}}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)'
              }}>
                <span style={{fontSize: '20px', color: 'white'}}>⚡</span>
              </div>
              <TrendingUp style={{width: '20px', height: '20px', color: '#16a34a'}} />
            </div>
            <p style={{fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
              {avgReaction ? `${avgReaction}ms` : '—'}
            </p>
            <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>Avg Reaction</p>
            <p style={{
              fontSize: '14px', 
              color: reactionTrend > 0 ? '#16a34a' : reactionTrend < 0 ? '#dc2626' : '#6b7280', 
              marginTop: '8px', 
              fontWeight: '600'
            }}>
              {reactionTrend !== 0 ? `${reactionTrend > 0 ? '↓' : '↑'} ${Math.abs(reactionTrend)}% ${reactionTrend > 0 ? 'improvement' : 'slower'}` : 'No trend data'}
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: '1px solid #f3f4f6',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            cursor: 'pointer'
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
            {/* Background gradient */}
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '64px',
              height: '64px',
              backgroundColor: '#10b981',
              opacity: '0.03',
              borderRadius: '50%',
              transform: 'translate(8px, -8px)'
            }}></div>
            
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: '10'}}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)'
              }}>
                <span style={{fontSize: '20px', color: 'white'}}>🧠</span>
              </div>
              <TrendingUp style={{width: '20px', height: '20px', color: '#16a34a'}} />
            </div>
            <p style={{fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
              {avgAlertness !== null ? avgAlertness : '—'}
            </p>
            <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>Avg Alertness</p>
            <p style={{
              fontSize: '14px', 
              color: alertnessTrend > 0 ? '#16a34a' : alertnessTrend < 0 ? '#dc2626' : '#6b7280', 
              marginTop: '8px', 
              fontWeight: '600'
            }}>
              {alertnessTrend !== 0 ? `${alertnessTrend > 0 ? '↑' : '↓'} ${Math.abs(alertnessTrend)}% ${alertnessTrend > 0 ? 'increase' : 'decrease'}` : 'No trend data'}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          <ChartPanel />
        </div>

        {/* Insights */}
        <div style={{
          marginTop: '24px',
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
            width: '96px',
            height: '96px',
            backgroundColor: '#8b5cf6',
            opacity: '0.03',
            borderRadius: '50%',
            transform: 'translate(16px, -16px)'
          }}></div>
          
          <div style={{position: 'relative', zIndex: '10'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
              <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>Insights</h3>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{fontSize: '18px'}}>💡</span>
              </div>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '16px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: '0',
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)'
                }}>
                  <span style={{fontSize: '18px', color: 'white'}}>✨</span>
                </div>
                <div>
                  <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0'}}>Best Performance Days</p>
                  <p style={{fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500', margin: '4px 0 0 0'}}>Tuesday and Thursday mornings show fastest reaction times</p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '16px',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: '0',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)'
                }}>
                  <span style={{fontSize: '18px', color: 'white'}}>📈</span>
                </div>
                <div>
                  <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0'}}>Consistency Streak</p>
                  <p style={{fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500', margin: '4px 0 0 0'}}>
                    {actualStreak} {actualStreak === 1 ? 'day' : 'days'} of morning assessments completed
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                borderRadius: '16px',
                border: '1px solid #fdba74'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: '0',
                  boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.25)'
                }}>
                  <span style={{fontSize: '18px', color: 'white'}}>🎯</span>
                </div>
                <div>
                  <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0'}}>Optimization Working</p>
                  <p style={{fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500', margin: '4px 0 0 0'}}>Morning light exposure correlates with 15% better alertness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}