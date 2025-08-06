'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import BottomNav from '@/components/BottomNav';
import DayNavigator from '@/components/DayNavigator';
import Notepad from '@/components/Notepad';

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [metrics, setMetrics] = useState<any>({});
  const [planCompleted, setPlanCompleted] = useState(false);

  useEffect(() => {
    if (user) {
      loadDataForDate(selectedDate);
    }
  }, [user, selectedDate]);

  const loadDataForDate = (date: Date) => {
    if (!user) return;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Load metrics
    if (user.id === 'demo-user') {
      const savedMetrics = localStorage.getItem(`demo_metrics_${dateStr}`);
      if (savedMetrics) {
        setMetrics(JSON.parse(savedMetrics));
      } else {
        setMetrics({});
      }
    }
    
    // Check plan completion
    const planKey = `plan_completed_${dateStr}`;
    const completedData = localStorage.getItem(planKey);
    
    if (completedData) {
      const data = JSON.parse(completedData);
      setPlanCompleted(data.completed === true);
    } else {
      setPlanCompleted(false);
    }
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
              <h1 style={{fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0'}}>History</h1>
              <p style={{color: '#6b7280', fontSize: '16px', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>View your past activities and notes</p>
            </div>
          </div>
          
          {/* Icon Display */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -3px rgba(139, 92, 246, 0.3), 0 4px 6px -2px rgba(139, 92, 246, 0.05)'
            }}>
              <span style={{fontSize: '40px', color: 'white'}}>📅</span>
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
        {/* Day Navigator */}
        <DayNavigator 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Metrics Summary */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          marginBottom: '24px'
        }}>
          <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '24px'}}>Daily Summary</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
            <div style={{
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <span style={{fontSize: '20px'}}>⚡</span>
              </div>
              <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Reaction Time</p>
              <p style={{fontSize: '24px', fontWeight: '700', color: '#111827'}}>
                {metrics.reaction_ms ? `${metrics.reaction_ms}ms` : '—'}
              </p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <span style={{fontSize: '20px'}}>🧠</span>
              </div>
              <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Alertness</p>
              <p style={{fontSize: '24px', fontWeight: '700', color: '#111827'}}>
                {metrics.mood_score ? `${metrics.mood_score}/10` : '—'}
              </p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <span style={{fontSize: '20px'}}>☀️</span>
              </div>
              <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Sunrise Plan</p>
              <p style={{fontSize: '16px', fontWeight: '700', color: planCompleted ? '#16a34a' : '#6b7280'}}>
                {planCompleted ? '✓ Complete' : 'Not Done'}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <h3 style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px'}}>Notes</h3>
        <Notepad selectedDate={selectedDate} />
      </div>

      <BottomNav />
    </div>
  );
}