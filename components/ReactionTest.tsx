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
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Reaction Time Test
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Tap the blue circles as quickly as possible. {totalTests} tests total.
        </p>
      </div>

      {!isRunning && !result && (
        <button
          onClick={startTest}
          className="apple-button-primary w-full"
        >
          Start Test
        </button>
      )}

      {isRunning && (
        <div className="space-y-6">
          <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>Test {currentTest + 1} of {totalTests}</span>
            <span className="font-medium">
              {isWaiting ? 'Get ready...' : 'Tap the circle!'}
            </span>
          </div>
          
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            onClick={handleCanvasClick}
            className="w-full rounded-2xl cursor-crosshair border shadow-inner"
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              aspectRatio: '4/3',
              background: 'var(--secondary-background)',
              borderColor: 'var(--border-color)'
            }}
          />
          
          <div className="w-full h-2 rounded-full" style={{ background: 'var(--secondary-background)' }}>
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(currentTest / totalTests) * 100}%`,
                background: 'var(--accent-blue)'
              }}
            />
          </div>
        </div>
      )}

      {result && (
        <div className="text-center space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {result.median}
            </div>
            <div className="text-lg text-gray-600 mb-1">ms</div>
            <div className="text-sm text-gray-600">Median Reaction Time</div>
          </div>
          
          <div className="text-xs p-3 rounded-xl" style={{ 
            color: 'var(--text-secondary)',
            background: 'var(--secondary-background)'
          }}>
            <p>Individual times: {result.reactions.join('ms, ')}ms</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startTest}
              className="apple-button-secondary flex-1"
            >
              Test Again
            </button>
            
            <button
              onClick={saveResult}
              disabled={saving}
              className="apple-button-primary flex-1 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Result'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}