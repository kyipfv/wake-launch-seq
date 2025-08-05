'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ReactionTest from '@/components/ReactionTest';
import BottomNav from '@/components/BottomNav';

export default function ReactionTestPage() {
  const router = useRouter();
  const [testComplete, setTestComplete] = useState(false);

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
            <h1 className="text-3xl font-bold text-gray-900">Reaction Time</h1>
            <p className="text-gray-500 text-lg font-medium mt-1">Test your response speed</p>
          </div>
        </div>
        
        {/* Icon Display */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">⚡</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-32">
        {/* Instructions Card */}
        {!testComplete && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
            
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-3xl text-white">ℹ️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">How it works</h2>
                <ul className="text-base text-gray-600 space-y-2 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Tap the blue circles as quickly as possible
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Complete 10 tests for accurate results
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Your median time will be recorded
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Test Component */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <ReactionTest onComplete={() => setTestComplete(true)} />
        </div>

        {/* Results History */}
        {testComplete && (
          <div className="mt-6 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Results</h3>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-xl text-white">⚡</span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Today</p>
                      <p className="text-sm text-gray-500 font-medium">Just now</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">247ms</p>
                    <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
                      <span>↓</span> 12ms improvement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}