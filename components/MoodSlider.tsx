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
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Alertness Check-In</h3>
        <p className="text-gray-300 text-sm">
          How alert do you feel 10 minutes after waking?
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="range"
            min="0"
            max="10"
            value={moodScore}
            onChange={(e) => setMoodScore(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #00BFFF 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-2">
            {moodScore}/10
          </div>
          <div className="text-gray-300 text-sm">
            {moodLabels[moodScore]}
          </div>
        </div>

        <button
          onClick={saveMood}
          disabled={saving}
          className="w-full bg-primary text-black py-3 px-4 rounded-lg font-semibold hover:bg-blue-400 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Log Alertness'}
        </button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00BFFF;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00BFFF;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}