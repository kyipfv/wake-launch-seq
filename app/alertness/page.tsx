'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import MoodSlider from '@/components/MoodSlider';
import BottomNav from '@/components/BottomNav';

export default function AlertnessPage() {
  const router = useRouter();
  const [savedToday, setSavedToday] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 pt-14 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => router.push('/home')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Alertness</h1>
        </div>
        <p className="text-gray-600">Track your energy levels</p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Current Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">How alert do you feel?</h2>
              <p className="text-sm text-gray-500 mt-1">Rate your current energy level</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🧠</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <MoodSlider onSave={() => setSavedToday(true)} />
          </div>
        </div>

        {/* Energy Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💡</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Morning Light</p>
                <p className="text-xs text-gray-500">Get 10-15 minutes of sunlight within 30 minutes of waking</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm">☕</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Delay Caffeine</p>
                <p className="text-xs text-gray-500">Wait 90-120 minutes after waking for optimal effect</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🚶</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Movement</p>
                <p className="text-xs text-gray-500">5-10 minutes of light exercise boosts alertness</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Log */}
        {savedToday && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Today's alertness logged</p>
                <p className="text-xs text-gray-600">Check trends to see your patterns</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}