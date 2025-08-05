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
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Reaction Time Test</h3>
        <p className="text-gray-300 text-sm">
          Click the blue circles as quickly as possible. {totalTests} tests total.
        </p>
      </div>

      {!isRunning && !result && (
        <button
          onClick={startTest}
          className="w-full bg-primary text-black py-3 px-4 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
        >
          Start Test
        </button>
      )}

      {isRunning && (
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Test {currentTest + 1} of {totalTests}</span>
            <span>{isWaiting ? 'Get ready...' : 'Click the circle!'}</span>
          </div>
          
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            onClick={handleCanvasClick}
            className="w-full bg-gray-900 rounded-lg cursor-crosshair border border-gray-600"
            style={{ maxWidth: '100%', height: 'auto', aspectRatio: '4/3' }}
          />
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentTest / totalTests) * 100}%` }}
            />
          </div>
        </div>
      )}

      {result && (
        <div className="text-center space-y-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-3xl font-bold text-primary mb-2">
              {result.median}ms
            </div>
            <div className="text-gray-300">Median Reaction Time</div>
          </div>
          
          <div className="text-sm text-gray-400">
            <p>Individual times: {result.reactions.join('ms, ')}ms</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={startTest}
              className="flex-1 border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary hover:text-black transition-colors"
            >
              Test Again
            </button>
            
            <button
              onClick={saveResult}
              disabled={saving}
              className="flex-1 bg-primary text-black py-2 px-4 rounded-lg font-semibold hover:bg-blue-400 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Result'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}