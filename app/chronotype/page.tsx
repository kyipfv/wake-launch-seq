'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

export default function ChronotypePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [chronoWindow, setChronoWindow] = useState('');

  useEffect(() => {
    if (user) {
      loadChronotype();
    }
  }, [user]);

  const loadChronotype = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('chrono_window')
      .eq('id', user.id)
      .single();
    
    if (data?.chrono_window) {
      setChronoWindow(data.chrono_window);
    }
  };

  const getChronotypeInfo = (window: string) => {
    if (window.startsWith('05:') || window.startsWith('06:00')) {
      return {
        type: 'Lark',
        icon: '🌅',
        color: 'bg-orange-100',
        textColor: 'text-orange-600',
        description: 'Early riser with peak performance in the morning'
      };
    } else if (window.startsWith('06:30') || window.startsWith('07:00')) {
      return {
        type: 'Third Bird',
        icon: '☀️',
        color: 'bg-yellow-100',
        textColor: 'text-yellow-600',
        description: 'Balanced type with steady energy throughout the day'
      };
    } else {
      return {
        type: 'Owl',
        icon: '🌙',
        color: 'bg-indigo-100',
        textColor: 'text-indigo-600',
        description: 'Late riser with peak performance in the evening'
      };
    }
  };

  const info = chronoWindow ? getChronotypeInfo(chronoWindow) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.push('/profile')}
            className="p-3 -ml-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chronotype</h1>
            <p className="text-gray-500 text-lg font-medium mt-1">Your biological sleep-wake preference</p>
          </div>
        </div>
        
        {/* Icon Display */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">🌙</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-32">
        {info && (
          <>
            {/* Chronotype Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
              {/* Background gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${info.color.replace('100', '500')} opacity-5 rounded-full -translate-y-8 translate-x-8`}></div>
              
              <div className="text-center relative z-10">
                <div className={`w-28 h-28 bg-gradient-to-br ${info.color.includes('orange') ? 'from-orange-500 to-yellow-500' : info.color.includes('yellow') ? 'from-yellow-500 to-orange-500' : 'from-indigo-500 to-purple-500'} rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg`}>
                  <span className="text-6xl text-white">{info.icon}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{info.type}</h2>
                <p className="text-base text-gray-600 mb-6 font-medium">{info.description}</p>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Optimal Wake Window</p>
                  <p className="text-2xl font-bold text-gray-900">{chronoWindow}</p>
                </div>
              </div>
            </div>

            {/* Characteristics */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
              {/* Background gradient */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Your Characteristics</h3>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">📊</span>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-lg text-white">⏰</span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Wake Time</p>
                      <p className="text-sm text-gray-600 mt-1 font-medium">Naturally wakes {chronoWindow}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-lg text-white">⚡</span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Peak Performance</p>
                      <p className="text-sm text-gray-600 mt-1 font-medium">
                        {info.type === 'Lark' ? '2-4 hours after waking' : 
                         info.type === 'Owl' ? 'Late afternoon to evening' : 
                         'Mid-morning to early afternoon'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-lg text-white">💤</span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">Ideal Bedtime</p>
                      <p className="text-sm text-gray-600 mt-1 font-medium">
                        {info.type === 'Lark' ? '9:00-10:00 PM' : 
                         info.type === 'Owl' ? '12:00-1:00 AM' : 
                         '10:30-11:30 PM'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Tips */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              {/* Background gradient */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Optimization Tips</h3>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <p className="text-base text-gray-700 font-medium">Schedule important tasks during your peak hours</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <p className="text-base text-gray-700 font-medium">Maintain consistent sleep-wake times</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <p className="text-base text-gray-700 font-medium">Get morning light exposure within your wake window</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <p className="text-base text-gray-700 font-medium">Avoid screens 2 hours before your ideal bedtime</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Retake Assessment */}
        <button
          onClick={() => router.push('/onboarding')}
          className="mt-6 w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:bg-gray-50 hover:scale-105 transition-all duration-200"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white">🔄</span>
            </div>
            <div className="text-left">
              <span className="text-lg font-bold text-indigo-600">Retake Assessment</span>
              <p className="text-sm text-gray-500 font-medium">Update your chronotype profile</p>
            </div>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}