'use client';

import { useState } from 'react';
import { Clock, Moon, Sun } from 'lucide-react';

export default function BedtimeCalculator() {
  const [wakeTime, setWakeTime] = useState('07:00');
  const [bedtimes, setBedtimes] = useState<string[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateBedtimes = () => {
    const [hours, minutes] = wakeTime.split(':').map(Number);
    
    // Create wake time as a Date object for today
    const wakeDateTime = new Date();
    wakeDateTime.setHours(hours, minutes, 0, 0);
    
    // If wake time is before current time, it's for tomorrow
    if (wakeDateTime <= new Date()) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1);
    }
    
    const fallAsleepTime = 15; // 15 minutes to fall asleep
    const cycleLength = 90; // 90-minute sleep cycles
    
    // Calculate bedtimes for 4, 5, and 6 sleep cycles (6-9 hours)
    const cycleCounts = [6, 5, 4]; // Most to least sleep
    const calculatedBedtimes: string[] = [];
    
    cycleCounts.forEach(cycles => {
      const totalSleepMinutes = cycles * cycleLength;
      const bedtime = new Date(wakeDateTime);
      bedtime.setMinutes(bedtime.getMinutes() - totalSleepMinutes - fallAsleepTime);
      
      const bedtimeStr = bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      calculatedBedtimes.push(bedtimeStr);
    });
    
    setBedtimes(calculatedBedtimes);
    setIsCalculated(true);
  };

  const getBedtimeInfo = (index: number) => {
    const cycles = [6, 5, 4][index];
    const hours = (cycles * 1.5).toFixed(1);
    const quality = cycles >= 6 ? 'Optimal' : cycles >= 5 ? 'Good' : 'Minimum';
    const color = cycles >= 6 ? '#10b981' : cycles >= 5 ? '#f59e0b' : '#ef4444';
    const bgColor = cycles >= 6 ? '#dcfce7' : cycles >= 5 ? '#fef3c7' : '#fee2e2';
    
    return { cycles, hours, quality, color, bgColor };
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
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '96px',
        height: '96px',
        backgroundColor: '#6366f1',
        opacity: '0.03',
        borderRadius: '50%',
        transform: 'translate(16px, -16px)'
      }}></div>
      
      <div style={{position: 'relative', zIndex: '10'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
          <div>
            <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>Bedtime Calculator</h3>
            <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>Based on 90-minute sleep cycles</p>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Moon style={{width: '20px', height: '20px', color: '#6366f1'}} />
          </div>
        </div>

        {/* Wake time input */}
        <div style={{
          marginBottom: '24px'
        }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px'
          }}>
            What time do you want to wake up?
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              position: 'relative',
              flex: '1'
            }}>
              <Clock style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#6b7280'
              }} />
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#f9fafb'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
              />
            </div>
            <button
              onClick={calculateBedtimes}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6366f1',
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5b21b6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(99, 102, 241, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6366f1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(99, 102, 241, 0.25)';
              }}
            >
              <Moon style={{width: '18px', height: '18px'}} />
              Calculate
            </button>
          </div>
        </div>

        {/* Results */}
        {isCalculated && (
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Recommended Bedtimes
            </h4>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {bedtimes.map((bedtime, index) => {
                const info = getBedtimeInfo(index);
                
                return (
                  <div
                    key={index}
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      border: `2px solid ${info.color}20`,
                      backgroundColor: info.bgColor,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 20px 0 ${info.color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: info.color,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Moon style={{width: '20px', height: '20px', color: 'white'}} />
                        </div>
                        <div>
                          <p style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#111827',
                            margin: '0'
                          }}>
                            {bedtime}
                          </p>
                          <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            fontWeight: '500',
                            margin: '0'
                          }}>
                            {info.hours} hours sleep
                          </p>
                        </div>
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: info.color,
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {info.quality}
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: info.color,
                          borderRadius: '50%'
                        }}></div>
                        {info.cycles} sleep cycles
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: info.color,
                          borderRadius: '50%'
                        }}></div>
                        15 min to fall asleep
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sleep science info */}
            <div style={{
              marginTop: '24px',
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h5 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sun style={{width: '18px', height: '18px', color: '#f59e0b'}} />
                Sleep Science
              </h5>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '500',
                lineHeight: '1.5'
              }}>
                <p style={{margin: '0 0 8px 0'}}>
                  Sleep occurs in 90-minute cycles. Waking up at the end of a cycle leaves you feeling refreshed.
                </p>
                <p style={{margin: '0'}}>
                  Most adults need 6-9 hours of sleep (4-6 cycles) for optimal health and performance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}