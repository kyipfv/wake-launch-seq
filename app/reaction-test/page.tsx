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
      <div className="bg-white border-b border-gray-200 px-6 pt-14 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => router.push('/home')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Reaction Time</h1>
        </div>
        <p className="text-gray-600">Test your response speed</p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Instructions Card */}
        {!testComplete && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">ℹ️</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">How it works</h2>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tap the blue circles as quickly as possible</li>
                  <li>• Complete 10 tests for accurate results</li>
                  <li>• Your median time will be recorded</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Test Component */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ReactionTest onComplete={() => setTestComplete(true)} />
        </div>

        {/* Results History */}
        {testComplete && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Today</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">247ms</p>
                  <p className="text-xs text-green-600">↓ 12ms</p>
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