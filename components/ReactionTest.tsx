'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface ReactionResult {
  median: number;
  reactions: number[];
}

export default function ReactionTest({ onComplete }: { onComplete?: (result: ReactionResult) => void }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [reactions, setReactions] = useState<number[]>([]);
  const [currentTest, setCurrentTest] = useState(0);
  const [result, setResult] = useState<ReactionResult | null>(null);
  const [saving, setSaving] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  const totalTests = 10;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const drawCircle = (x: number, y: number, radius: number = 30) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00BFFF';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startNextTest = () => {
    if (currentTest >= totalTests) {
      completeTest();
      return;
    }

    setIsWaiting(true);
    clearCanvas();

    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    
    timeoutRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const x = Math.random() * (canvas.width - 60) + 30;
      const y = Math.random() * (canvas.height - 60) + 30;
      
      drawCircle(x, y);
      startTimeRef.current = performance.now();
      setIsWaiting(false);
    }, delay);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isRunning || isWaiting) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is on the circle (simplified - just check if canvas has content)
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData.data.some(pixel => pixel > 0);

    if (hasContent) {
      const reactionTime = performance.now() - startTimeRef.current;
      const newReactions = [...reactions, reactionTime];
      setReactions(newReactions);
      setCurrentTest(currentTest + 1);
      
      clearCanvas();
      
      if (currentTest + 1 < totalTests) {
        setTimeout(startNextTest, 500); // Brief pause between tests
      } else {
        completeTest(newReactions);
      }
    }
  };

  const completeTest = (finalReactions: number[] = reactions) => {
    const sortedReactions = [...finalReactions].sort((a, b) => a - b);
    const median = sortedReactions[Math.floor(sortedReactions.length / 2)];
    
    const testResult = {
      median: Math.round(median),
      reactions: sortedReactions.map(r => Math.round(r))
    };
    
    setResult(testResult);
    setIsRunning(false);
    onComplete?.(testResult);
  };

  const startTest = () => {
    setIsRunning(true);
    setReactions([]);
    setCurrentTest(0);
    setResult(null);
    startNextTest();
  };

  const saveResult = async () => {
    if (!result || !user) return;
    
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    
    // Handle demo user - save to localStorage
    if (user.id === 'demo-user') {
      // Load existing metrics or create new object
      const savedMetrics = localStorage.getItem(`demo_metrics_${today}`);
      const metrics = savedMetrics ? JSON.parse(savedMetrics) : {};
      
      // Update reaction time
      metrics.reaction_ms = result.median;
      
      // Save back to localStorage
      localStorage.setItem(`demo_metrics_${today}`, JSON.stringify(metrics));
      
      setSaving(false);
      return;
    }

    // Handle real users - save to database
    const { error } = await supabase
      .from('metrics')
      .upsert({
        user_id: user.id,
        date: today,
        reaction_ms: result.median,
      });

    if (error) {
      console.error('Error saving reaction time:', error);
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
      
      <div style={{marginBottom: '32px', position: 'relative', zIndex: '10'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
          <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>
            Reaction Time Test
          </h3>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{fontSize: '18px'}}>⚡</span>
          </div>
        </div>
        <p style={{fontSize: '16px', color: '#6b7280', fontWeight: '500'}}>
          Tap the blue circles as quickly as possible. {totalTests} tests total.
        </p>
      </div>

      {!isRunning && !result && (
        <div style={{position: 'relative', zIndex: '10'}}>
          <button
            onClick={startTest}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
              <span>⚡</span>
              Start Test
            </div>
          </button>
        </div>
      )}

      {isRunning && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: '10'}}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px'
          }}>
            <span style={{fontSize: '16px', fontWeight: '600', color: '#111827'}}>
              Test {currentTest + 1} of {totalTests}
            </span>
            <span style={{fontSize: '18px', fontWeight: '700', color: '#3b82f6'}}>
              {isWaiting ? '🔄 Get ready...' : '🎯 Tap the circle!'}
            </span>
          </div>
          
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            onClick={handleCanvasClick}
            style={{
              width: '100%',
              borderRadius: '16px',
              cursor: 'crosshair',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              backgroundColor: '#f9fafb',
              maxWidth: '100%',
              height: 'auto',
              aspectRatio: '4/3'
            }}
          />
          
          <div style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={{fontSize: '14px', fontWeight: '500', color: '#374151'}}>Progress</span>
              <span style={{fontSize: '14px', fontWeight: '700', color: '#111827'}}>{currentTest}/{totalTests}</span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              backgroundColor: '#e5e7eb',
              borderRadius: '6px'
            }}>
              <div 
                style={{
                  height: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease',
                  width: `${(currentTest / totalTests) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {result && (
        <div style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: '10'}}>
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #bbf7d0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '64px',
              height: '64px',
              backgroundColor: '#10b981',
              opacity: '0.1',
              borderRadius: '50%',
              transform: 'translate(8px, -8px)'
            }}></div>
            
            <div style={{position: 'relative', zIndex: '10'}}>
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
                <span style={{fontSize: '24px', color: 'white'}}>🎯</span>
              </div>
              <div style={{fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
                {result.median}
              </div>
              <div style={{fontSize: '20px', color: '#6b7280', marginBottom: '4px', fontWeight: '600'}}>milliseconds</div>
              <div style={{fontSize: '16px', color: '#6b7280', fontWeight: '500'}}>Median Reaction Time</div>
            </div>
          </div>
          
          <div style={{
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px'
          }}>
            <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>
              Individual times: {result.reactions.join('ms, ')}ms
            </p>
          </div>

          <div style={{display: 'flex', gap: '16px'}}>
            <button
              onClick={startTest}
              style={{
                flex: '1',
                padding: '12px 24px',
                backgroundColor: 'white',
                border: '2px solid #3b82f6',
                color: '#3b82f6',
                fontWeight: '600',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
              }}
            >
              Test Again
            </button>
            
            <button
              onClick={saveResult}
              disabled={saving}
              style={{
                flex: '1',
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
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
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.15)';
                }
              }}
            >
              {saving ? '⏳ Saving...' : '💾 Save Result'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}