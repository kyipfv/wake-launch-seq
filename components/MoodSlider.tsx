'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function MoodSlider({ onSave }: { onSave?: (score: number) => void }) {
  const [moodScore, setMoodScore] = useState(5);
  const [saving, setSaving] = useState(false);
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
    }
    
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
      
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Alertness Check-In</h3>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
        </div>
        <p className="text-base text-gray-600 font-medium">
          How alert do you feel 10 minutes after waking?
        </p>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="p-6 bg-gray-50 rounded-2xl">
          <div className="relative mb-6">
            <input
              type="range"
              min="0"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white">🧠</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {moodScore}/10
            </div>
            <div className="text-base text-gray-600 font-medium">
              {moodLabels[moodScore]}
            </div>
          </div>
        </div>

        <button
          onClick={saveMood}
          disabled={saving}
          className="w-full py-4 px-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-3xl hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none shadow-md"
        >
          {saving ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span>📊</span>
              Log Alertness
            </div>
          )}
        </button>
      </div>

      <style jsx>{`
        .slider {
          background: linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%) !important;
        }
        
        .slider::-webkit-slider-thumb {
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
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  );
}