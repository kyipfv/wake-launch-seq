'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import ChartPanel from '@/components/ChartPanel';
import BottomNav from '@/components/BottomNav';

export default function TrendsPage() {
  const router = useRouter();

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
          <h1 className="text-2xl font-bold text-gray-900">Trends</h1>
        </div>
        <p className="text-gray-600">14-day performance analysis</p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">235ms</p>
            <p className="text-xs text-gray-500">Avg Reaction</p>
            <p className="text-xs text-green-600 mt-1">↓ 8% improvement</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🧠</span>
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">7.8</p>
            <p className="text-xs text-gray-500">Avg Alertness</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% increase</p>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ChartPanel />
        </div>

        {/* Insights */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm">✨</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Best Performance Days</p>
                <p className="text-xs text-gray-500">Tuesday and Thursday mornings show fastest reaction times</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm">📈</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Consistency Streak</p>
                <p className="text-xs text-gray-500">7 days of morning assessments completed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🎯</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Optimization Working</p>
                <p className="text-xs text-gray-500">Morning light exposure correlates with 15% better alertness</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}