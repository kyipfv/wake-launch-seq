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
      <div className="bg-white px-6 pt-16 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.push('/home')}
            className="p-3 -ml-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trends</h1>
            <p className="text-gray-500 text-lg font-medium mt-1">14-day performance analysis</p>
          </div>
        </div>
        
        {/* Icon Display */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">📊</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-32">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-5 rounded-full -translate-y-2 translate-x-2"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl text-white">⚡</span>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">235ms</p>
            <p className="text-sm text-gray-500 font-medium">Avg Reaction</p>
            <p className="text-sm text-green-600 mt-2 font-semibold">↓ 8% improvement</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 opacity-5 rounded-full -translate-y-2 translate-x-2"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl text-white">🧠</span>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">7.8</p>
            <p className="text-sm text-gray-500 font-medium">Avg Alertness</p>
            <p className="text-sm text-green-600 mt-2 font-semibold">↑ 12% increase</p>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <ChartPanel />
        </div>

        {/* Insights */}
        <div className="mt-6 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Insights</h3>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-lg">💡</span>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg text-white">✨</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Best Performance Days</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Tuesday and Thursday mornings show fastest reaction times</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg text-white">📈</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Consistency Streak</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">7 days of morning assessments completed</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg text-white">🎯</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Optimization Working</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Morning light exposure correlates with 15% better alertness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}