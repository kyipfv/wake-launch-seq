'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ReactionTest from '@/components/ReactionTest';
import BottomNav from '@/components/BottomNav';

export default function ReactionTestPage() {
  const router = useRouter();
  const [testComplete, setTestComplete] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

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
              <h1 style={{fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0'}}>Reaction Time</h1>
              <p style={{color: '#6b7280', fontSize: '16px', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>Test your response speed</p>
            </div>
          </div>
          
          {/* Icon Display */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.05)'
            }}>
              <span style={{fontSize: '40px', color: 'white'}}>⚡</span>
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
        {/* Instructions Card */}
        {!testComplete && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: '1px solid #f3f4f6',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            {/* Background gradient */}
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '96px',
              height: '96px',
              backgroundColor: '#3b82f6',
              opacity: '0.03',
              borderRadius: '50%',
              transform: 'translate(16px, -16px)'
            }}></div>
            
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '24px', position: 'relative', zIndex: '10'}}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: '0',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)'
              }}>
                <span style={{fontSize: '28px', color: 'white'}}>ℹ️</span>
              </div>
              <div>
                <h2 style={{fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px'}}>How it works</h2>
                <ul style={{fontSize: '16px', color: '#6b7280', fontWeight: '500', listStyle: 'none', padding: '0', margin: '0'}}>
                  <li style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <div style={{width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
                    Tap the blue circles as quickly as possible
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <div style={{width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
                    Complete 10 tests for accurate results
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
                    Your median time will be recorded
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Test Component */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          <ReactionTest onComplete={(result) => {
            setTestComplete(true);
            setTestResult(result);
          }} />
        </div>

        {/* Results History */}
        {testComplete && (
          <div style={{
            marginTop: '24px',
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
              opacity: '0.03',
              borderRadius: '50%',
              transform: 'translate(16px, -16px)'
            }}></div>
            
            <div style={{position: 'relative', zIndex: '10'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
                <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>Recent Results</h3>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{fontSize: '18px'}}>📊</span>
                </div>
              </div>
              
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px',
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
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)'
                    }}>
                      <span style={{fontSize: '20px', color: 'white'}}>⚡</span>
                    </div>
                    <div>
                      <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0'}}>Today</p>
                      <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: '4px 0 0 0'}}>Just now</p>
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <p style={{fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0'}}>
                      {testResult?.median || 0}ms
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#16a34a',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      margin: '4px 0 0 0',
                      justifyContent: 'flex-end'
                    }}>
                      <span>✓</span> Test completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}