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
      <div className="bg-white px-6 pt-16 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.push('/home')}
            className="p-3 -ml-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alertness</h1>
            <p className="text-gray-500 text-lg font-medium mt-1">Track your energy levels</p>
          </div>
        </div>
        
        {/* Icon Display */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">🧠</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-32">
        {/* Current Status Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">How alert do you feel?</h2>
              <p className="text-base text-gray-500 mt-2 font-medium">Rate your current energy level</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white">🧠</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 relative z-10">
            <MoodSlider onSave={() => setSavedToday(true)} />
          </div>
        </div>

        {/* Energy Tips */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Energy Tips</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">💡</span>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg text-white">☀️</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Morning Light</p>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Get 10-15 minutes of sunlight within 30 minutes of waking</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg text-white">☕</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Delay Caffeine</p>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Wait 90-120 minutes after waking for optimal effect</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg text-white">🚶</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Movement</p>
                  <p className="text-sm text-gray-500 mt-1 font-medium">5-10 minutes of light exercise boosts alertness</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Log */}
        {savedToday && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">✓</span>
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">Today's alertness logged</p>
                <p className="text-sm text-gray-600 font-medium mt-1">Check trends to see your patterns</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}