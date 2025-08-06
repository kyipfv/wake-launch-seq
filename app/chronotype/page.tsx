'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

export default function ChronotypePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [chronoWindow, setChronoWindow] = useState('');

  useEffect(() => {
    if (user) {
      loadChronotype();
    }
  }, [user]);

  const loadChronotype = async () => {
    if (!user) return;
    
    // Handle demo user
    if (user.id === 'demo-user') {
      // Set a default chronotype for demo user
      setChronoWindow('06:30-07:30');
      return;
    }
    
    // Handle real users
    const { data } = await supabase
      .from('profiles')
      .select('chrono_window')
      .eq('id', user.id)
      .single();
    
    if (data?.chrono_window) {
      setChronoWindow(data.chrono_window);
    }
  };

  const getChronotypeInfo = (window: string) => {
    if (window.startsWith('05:') || window.startsWith('06:00')) {
      return {
        type: 'Lark',
        icon: '🌅',
        color: 'bg-orange-100',
        textColor: 'text-orange-600',
        description: 'Early riser with peak performance in the morning'
      };
    } else if (window.startsWith('06:30') || window.startsWith('07:00')) {
      return {
        type: 'Third Bird',
        icon: '☀️',
        color: 'bg-yellow-100',
        textColor: 'text-yellow-600',
        description: 'Balanced type with steady energy throughout the day'
      };
    } else {
      return {
        type: 'Owl',
        icon: '🌙',
        color: 'bg-indigo-100',
        textColor: 'text-indigo-600',
        description: 'Late riser with peak performance in the evening'
      };
    }
  };

  const info = chronoWindow ? getChronotypeInfo(chronoWindow) : null;

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
              onClick={() => router.push('/profile')}
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
              <h1 style={{fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0'}}>Chronotype</h1>
              <p style={{color: '#6b7280', fontSize: '16px', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>Your biological sleep-wake preference</p>
            </div>
          </div>
          
          {/* Icon Display */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.05)'
            }}>
              <span style={{fontSize: '40px', color: 'white'}}>🌙</span>
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
        {info && (
          <>
            {/* Chronotype Card */}
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
                backgroundColor: info.type === 'Lark' ? '#f59e0b' : info.type === 'Third Bird' ? '#eab308' : '#6366f1',
                opacity: '0.03',
                borderRadius: '50%',
                transform: 'translate(16px, -16px)'
              }}></div>
              
              <div style={{textAlign: 'center', position: 'relative', zIndex: '10'}}>
                <div style={{
                  width: '112px',
                  height: '112px',
                  background: info.type === 'Lark' 
                    ? 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)'
                    : info.type === 'Third Bird'
                    ? 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)'
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '24px',
                  margin: '0 auto 24px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}>
                  <span style={{fontSize: '56px', color: 'white'}}>{info.icon}</span>
                </div>
                <h2 style={{fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '12px'}}>{info.type}</h2>
                <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '24px', fontWeight: '500'}}>{info.description}</p>
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #f3f4f6'
                }}>
                  <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '500'}}>Optimal Wake Window</p>
                  <p style={{fontSize: '24px', fontWeight: '700', color: '#111827'}}>{chronoWindow}</p>
                </div>
              </div>
            </div>

            {/* Characteristics */}
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
                width: '80px',
                height: '80px',
                backgroundColor: '#3b82f6',
                opacity: '0.03',
                borderRadius: '50%',
                transform: 'translate(16px, -16px)'
              }}></div>
              
              <div style={{position: 'relative', zIndex: '10'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
                  <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>Your Characteristics</h3>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{fontSize: '18px'}}>📊</span>
                  </div>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
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
                      <span style={{fontSize: '18px', color: 'white'}}>⏰</span>
                    </div>
                    <div>
                      <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px'}}>Wake Time</p>
                      <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>Naturally wakes {chronoWindow}</p>
                    </div>
                  </div>
                  
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
                      <span style={{fontSize: '18px', color: 'white'}}>⚡</span>
                    </div>
                    <div>
                      <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px'}}>Peak Performance</p>
                      <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>
                        {info.type === 'Lark' ? '2-4 hours after waking' : 
                         info.type === 'Owl' ? 'Late afternoon to evening' : 
                         'Mid-morning to early afternoon'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                    borderRadius: '16px',
                    border: '1px solid #e9d5ff'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: '0',
                      boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.25)'
                    }}>
                      <span style={{fontSize: '18px', color: 'white'}}>💤</span>
                    </div>
                    <div>
                      <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px'}}>Ideal Bedtime</p>
                      <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>
                        {info.type === 'Lark' ? '9:00-10:00 PM' : 
                         info.type === 'Owl' ? '12:00-1:00 AM' : 
                         '10:30-11:30 PM'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Tips */}
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
                opacity: '0.03',
                borderRadius: '50%',
                transform: 'translate(16px, -16px)'
              }}></div>
              
              <div style={{position: 'relative', zIndex: '10'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
                  <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>Optimization Tips</h3>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{fontSize: '18px'}}>🎯</span>
                  </div>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '16px'}}>
                    <div style={{width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', flexShrink: '0'}}></div>
                    <p style={{fontSize: '16px', color: '#374151', fontWeight: '500'}}>Schedule important tasks during your peak hours</p>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '16px'}}>
                    <div style={{width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', flexShrink: '0'}}></div>
                    <p style={{fontSize: '16px', color: '#374151', fontWeight: '500'}}>Maintain consistent sleep-wake times</p>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '16px'}}>
                    <div style={{width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', flexShrink: '0'}}></div>
                    <p style={{fontSize: '16px', color: '#374151', fontWeight: '500'}}>Get morning light exposure within your wake window</p>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '16px'}}>
                    <div style={{width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', flexShrink: '0'}}></div>
                    <p style={{fontSize: '16px', color: '#374151', fontWeight: '500'}}>Avoid screens 2 hours before your ideal bedtime</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Retake Assessment */}
        <button
          onClick={() => router.push('/onboarding')}
          style={{
            marginTop: '24px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: '1px solid #f3f4f6',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
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
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)'
            }}>
              <span style={{fontSize: '24px', color: 'white'}}>🔄</span>
            </div>
            <div style={{textAlign: 'left'}}>
              <span style={{fontSize: '18px', fontWeight: '700', color: '#6366f1'}}>Retake Assessment</span>
              <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: '4px 0 0 0'}}>Update your chronotype profile</p>
            </div>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}