'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function MoodSlider({ onSave }: { onSave?: (score: number) => void }) {
  const [moodScore, setMoodScore] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  const moodLabels = [
    'Completely Exhausted',
    'Very Tired',
    'Tired',
    'Somewhat Tired',
    'Neither Alert nor Tired',
    'Somewhat Alert',
    'Alert',
    'Very Alert',
    'Extremely Alert',
    'Peak Performance',
    'Maximum Alertness'
  ];

  const saveMood = async () => {
    if (!user) return;
    
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    
    // Handle demo user - save to localStorage
    if (user.id === 'demo-user') {
      // Load existing metrics or create new object
      const savedMetrics = localStorage.getItem(`demo_metrics_${today}`);
      const metrics = savedMetrics ? JSON.parse(savedMetrics) : {};
      
      // Update mood score
      metrics.mood_score = moodScore;
      
      // Save back to localStorage
      localStorage.setItem(`demo_metrics_${today}`, JSON.stringify(metrics));
      
      onSave?.(moodScore);
      setSaved(true);
      setSaving(false);
      return;
    }

    // Handle real users - save to database
    const { error } = await supabase
      .from('metrics')
      .upsert({
        user_id: user.id,
        date: today,
        mood_score: moodScore,
      });

    if (error) {
      console.error('Error saving mood score:', error);
    } else {
      onSave?.(moodScore);
      setSaved(true);
    }
    
    setSaving(false);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid #f3f4f6',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '80px',
        height: '80px',
        backgroundColor: '#10b981',
        opacity: '0.05',
        borderRadius: '50%',
        transform: 'translate(16px, -16px)'
      }}></div>
      
      <div style={{marginBottom: '32px', position: 'relative', zIndex: '10'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
          <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>Alertness Check-In</h3>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{fontSize: '18px'}}>🧠</span>
          </div>
        </div>
        <p style={{fontSize: '16px', color: '#6b7280', fontWeight: '500'}}>
          How alert do you feel 10 minutes after waking?
        </p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: '10'}}>
        <div style={{
          padding: '24px',
          backgroundColor: '#f9fafb',
          borderRadius: '16px'
        }}>
          <div style={{position: 'relative', marginBottom: '24px'}}>
            <input
              type="range"
              min="0"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#e5e7eb',
                borderRadius: '6px',
                appearance: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)'
              }}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', marginTop: '12px', fontWeight: '500'}}>
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px',
              margin: '0 auto 16px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)'
            }}>
              <span style={{fontSize: '24px', color: 'white'}}>🧠</span>
            </div>
            <div style={{fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
              {moodScore}/10
            </div>
            <div style={{fontSize: '16px', color: '#6b7280', fontWeight: '500'}}>
              {moodLabels[moodScore]}
            </div>
          </div>
        </div>

        {!saved ? (
          <button
            onClick={saveMood}
            disabled={saving}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '12px',
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
              opacity: saving ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.15)';
              }
            }}
          >
            {saving ? (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Saving...
              </div>
            ) : (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
                <span>📊</span>
                Log Alertness
              </div>
            )}
          </button>
        ) : (
          <div style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            color: '#166534',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '12px',
            border: '1px solid #bbf7d0',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <span>✓</span>
            Alertness Logged
          </div>
        )}
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}