'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Sun, Clock } from 'lucide-react';
import PlanCard from '@/components/PlanCard';
import BottomNav from '@/components/BottomNav';

export default function SunrisePlanPage() {
  const router = useRouter();

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
              <h1 style={{fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0'}}>Sunrise Plan</h1>
              <p style={{color: '#6b7280', fontSize: '16px', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>Tomorrow's wake optimization</p>
            </div>
          </div>
          
          {/* Icon Display */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -2px rgba(245, 158, 11, 0.05)'
            }}>
              <span style={{fontSize: '40px', color: 'white'}}>☀️</span>
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
        {/* Plan Card - Updated Style */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          <PlanCard />
        </div>

        {/* Light Exposure Guide */}
        <div style={{
          marginTop: '24px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)'
        }}>
          {/* Background gradient */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '96px',
            height: '96px',
            backgroundColor: '#f59e0b',
            opacity: '0.03',
            borderRadius: '50%',
            transform: 'translate(16px, -16px)'
          }}></div>
          
          <div style={{position: 'relative', zIndex: '10'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
              <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>Light Exposure Guide</h3>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{fontSize: '18px'}}>💡</span>
              </div>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                borderRadius: '16px',
                border: '1px solid #fed7aa'
              }}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: '0',
                    boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.25)'
                  }}>
                    <Sun style={{width: '32px', height: '32px', color: 'white'}} />
                  </div>
                  <div style={{flex: '1'}}>
                    <h4 style={{fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>Outdoor Light</h4>
                    <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '16px', fontWeight: '500'}}>Best option for circadian alignment</p>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <ul style={{fontSize: '14px', color: '#374151', fontWeight: '500', listStyle: 'none', padding: '0', margin: '0'}}>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                          <div style={{width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%'}}></div>
                          10,000+ lux natural light
                        </li>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                          <div style={{width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%'}}></div>
                          Full spectrum exposure
                        </li>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <div style={{width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%'}}></div>
                          10-15 minutes minimum
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)',
                borderRadius: '16px',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
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
                    <span style={{fontSize: '28px', color: 'white'}}>💡</span>
                  </div>
                  <div style={{flex: '1'}}>
                    <h4 style={{fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>Light Therapy Box</h4>
                    <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '16px', fontWeight: '500'}}>Indoor alternative</p>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <ul style={{fontSize: '14px', color: '#374151', fontWeight: '500', listStyle: 'none', padding: '0', margin: '0'}}>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                          <div style={{width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
                          10,000 lux brightness
                        </li>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                          <div style={{width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
                          12-16 inches from face
                        </li>
                        <li style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <div style={{width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
                          20-30 minutes duration
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Settings Prompt */}
        <div style={{
          marginTop: '24px',
          background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)',
          border: '1px solid #d8b4fe',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.25)'
            }}>
              <MapPin style={{width: '32px', height: '32px', color: 'white'}} />
            </div>
            <div style={{flex: '1'}}>
              <p style={{fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0'}}>Set your location</p>
              <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>Get accurate sunrise times for your city</p>
            </div>
            <button 
              onClick={() => router.push('/settings')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                fontWeight: '600',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7c3aed';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8b5cf6';
              }}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}