'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Sun, Clock } from 'lucide-react';
import PlanCard from '@/components/PlanCard';
import BottomNav from '@/components/BottomNav';

export default function SunrisePlanPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Sunrise Plan</h1>
        </div>
        <p className="text-gray-600">Tomorrow's wake optimization</p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Plan Card - Updated Style */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <PlanCard />
        </div>

        {/* Light Exposure Guide */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Light Exposure Guide</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sun className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Outdoor Light</h4>
                <p className="text-sm text-gray-600 mb-2">Best option for circadian alignment</p>
                <div className="bg-orange-50 rounded-lg p-3">
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 10,000+ lux natural light</li>
                    <li>• Full spectrum exposure</li>
                    <li>• 10-15 minutes minimum</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Light Therapy Box</h4>
                <p className="text-sm text-gray-600 mb-2">Indoor alternative</p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• 10,000 lux brightness</li>
                    <li>• 12-16 inches from face</li>
                    <li>• 20-30 minutes duration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Settings Prompt */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-purple-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Set your location</p>
              <p className="text-xs text-gray-600">Get accurate sunrise times for your city</p>
            </div>
            <button 
              onClick={() => router.push('/settings')}
              className="text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              Settings →
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}