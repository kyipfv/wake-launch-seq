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
      <div className="bg-white px-6 pt-16 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.push('/home')}
            className="p-3 -ml-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sunrise Plan</h1>
            <p className="text-gray-500 text-lg font-medium mt-1">Tomorrow's wake optimization</p>
          </div>
        </div>
        
        {/* Icon Display */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">☀️</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-32">
        {/* Plan Card - Updated Style */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <PlanCard />
        </div>

        {/* Light Exposure Guide */}
        <div className="mt-6 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Light Exposure Guide</h3>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-lg">💡</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sun className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Outdoor Light</h4>
                    <p className="text-base text-gray-600 mb-4 font-medium">Best option for circadian alignment</p>
                    <div className="bg-white/80 rounded-xl p-4">
                      <ul className="text-sm text-gray-700 space-y-2 font-medium">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          10,000+ lux natural light
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Full spectrum exposure
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          10-15 minutes minimum
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-3xl text-white">💡</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Light Therapy Box</h4>
                    <p className="text-base text-gray-600 mb-4 font-medium">Indoor alternative</p>
                    <div className="bg-white/80 rounded-xl p-4">
                      <ul className="text-sm text-gray-700 space-y-2 font-medium">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          10,000 lux brightness
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          12-16 inches from face
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          20-30 minutes duration
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Settings Prompt */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-gray-900">Set your location</p>
              <p className="text-sm text-gray-600 font-medium mt-1">Get accurate sunrise times for your city</p>
            </div>
            <button 
              onClick={() => router.push('/settings')}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition-colors shadow-md"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}