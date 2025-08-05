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
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
      
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Reaction Time Test
          </h3>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
        </div>
        <p className="text-base text-gray-600 font-medium">
          Tap the blue circles as quickly as possible. {totalTests} tests total.
        </p>
      </div>

      {!isRunning && !result && (
        <div className="relative z-10">
          <button
            onClick={startTest}
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-3xl hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
          >
            <div className="flex items-center justify-center gap-3">
              <span>⚡</span>
              Start Test
            </div>
          </button>
        </div>
      )}

      {isRunning && (
        <div className="space-y-6 relative z-10">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
            <span className="text-base font-semibold text-gray-900">Test {currentTest + 1} of {totalTests}</span>
            <span className="text-lg font-bold text-blue-600">
              {isWaiting ? '🔄 Get ready...' : '🎯 Tap the circle!'}
            </span>
          </div>
          
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            onClick={handleCanvasClick}
            className="w-full rounded-3xl cursor-crosshair border border-gray-200 shadow-sm bg-gray-50"
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              aspectRatio: '4/3'
            }}
          />
          
          <div className="p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-gray-900">{currentTest}/{totalTests}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div 
                className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentTest / totalTests) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="text-center space-y-6 relative z-10">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 opacity-10 rounded-full -translate-y-2 translate-x-2"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">🎯</span>
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {result.median}
              </div>
              <div className="text-xl text-gray-600 mb-1 font-semibold">milliseconds</div>
              <div className="text-base text-gray-600 font-medium">Median Reaction Time</div>
            </div>
          </div>
          
          <div className="p-5 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-600 font-medium">Individual times: {result.reactions.join('ms, ')}ms</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startTest}
              className="flex-1 py-3 px-6 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm"
            >
              Test Again
            </button>
            
            <button
              onClick={saveResult}
              disabled={saving}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none shadow-md"
            >
              {saving ? '⏳ Saving...' : '💾 Save Result'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}