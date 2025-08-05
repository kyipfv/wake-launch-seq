'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import MoodSlider from '@/components/MoodSlider';
import BottomNav from '@/components/BottomNav';

export default function AlertnessPage() {
  const router = useRouter();
  const [savedToday, setSavedToday] = useState(false);

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
              <h1 style={{fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0'}}>Alertness</h1>
              <p style={{color: '#6b7280', fontSize: '16px', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>Track your energy levels</p>
            </div>
          </div>
          
          {/* Icon Display */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.05)'
            }}>
              <span style={{fontSize: '40px', color: 'white'}}>🧠</span>
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
        {/* Current Status Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
        }}>
          {/* Background gradient */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '96px',
            height: '96px',
            backgroundColor: '#10b981',
            opacity: '0.03',
            borderRadius: '50%',
            transform: 'translate(16px, -16px)'
          }}></div>
          
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative', zIndex: '10'}}>
            <div>
              <h2 style={{fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0'}}>How alert do you feel?</h2>
              <p style={{fontSize: '16px', color: '#6b7280', marginTop: '8px', fontWeight: '500', margin: '8px 0 0 0'}}>Rate your current energy level</p>
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)'
            }}>
              <span style={{fontSize: '28px', color: 'white'}}>🧠</span>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            zIndex: '10'
          }}>
            <MoodSlider onSave={() => setSavedToday(true)} />
          </div>
        </div>

        {/* Energy Tips */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)'
        }}>
          {/* Background gradient */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '80px',
            height: '80px',
            backgroundColor: '#3b82f6',
            opacity: '0.03',
            borderRadius: '50%',
            transform: 'translate(16px, -16px)'
          }}></div>
          
          <div style={{position: 'relative', zIndex: '10'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
              <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>Energy Tips</h3>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
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
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: '0',
                  boxShadow: '0 4px 14px 0 rgba(251, 191, 36, 0.25)'
                }}>
                  <span style={{fontSize: '18px', color: 'white'}}>☀️</span>
                </div>
                <div>
                  <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0'}}>Morning Light</p>
                  <p style={{fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500', margin: '4px 0 0 0'}}>Get 10-15 minutes of sunlight within 30 minutes of waking</p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: '0',
                  boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.25)'
                }}>
                  <span style={{fontSize: '18px', color: 'white'}}>☕</span>
                </div>
                <div>
                  <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0'}}>Delay Caffeine</p>
                  <p style={{fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500', margin: '4px 0 0 0'}}>Wait 90-120 minutes after waking for optimal effect</p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: '0',
                  boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.25)'
                }}>
                  <span style={{fontSize: '18px', color: 'white'}}>🚶</span>
                </div>
                <div>
                  <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0'}}>Movement</p>
                  <p style={{fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500', margin: '4px 0 0 0'}}>5-10 minutes of light exercise boosts alertness</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Log */}
        {savedToday && (
          <div style={{
            marginTop: '24px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.25)'
              }}>
                <span style={{color: 'white', fontSize: '24px'}}>✓</span>
              </div>
              <div>
                <p style={{fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0'}}>Today's alertness logged</p>
                <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>Check trends to see your patterns</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}