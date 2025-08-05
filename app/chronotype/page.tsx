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
      <div className="bg-white border-b border-gray-200 px-6 pt-14 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => router.push('/profile')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Chronotype</h1>
        </div>
        <p className="text-gray-600">Your biological sleep-wake preference</p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {info && (
          <>
            {/* Chronotype Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="text-center">
                <div className={`w-24 h-24 ${info.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <span className="text-5xl">{info.icon}</span>
                </div>
                <h2 className={`text-2xl font-bold ${info.textColor} mb-2`}>{info.type}</h2>
                <p className="text-sm text-gray-600 mb-4">{info.description}</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Optimal Wake Window</p>
                  <p className="text-lg font-bold text-gray-900">{chronoWindow}</p>
                </div>
              </div>
            </div>

            {/* Characteristics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Characteristics</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">⏰</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Wake Time</p>
                    <p className="text-xs text-gray-500">Naturally wakes {chronoWindow}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Peak Performance</p>
                    <p className="text-xs text-gray-500">
                      {info.type === 'Lark' ? '2-4 hours after waking' : 
                       info.type === 'Owl' ? 'Late afternoon to evening' : 
                       'Mid-morning to early afternoon'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">💤</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ideal Bedtime</p>
                    <p className="text-xs text-gray-500">
                      {info.type === 'Lark' ? '9:00-10:00 PM' : 
                       info.type === 'Owl' ? '12:00-1:00 AM' : 
                       '10:30-11:30 PM'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Tips</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Schedule important tasks during your peak hours</p>
                <p className="text-sm text-gray-600">• Maintain consistent sleep-wake times</p>
                <p className="text-sm text-gray-600">• Get morning light exposure within your wake window</p>
                <p className="text-sm text-gray-600">• Avoid screens 2 hours before your ideal bedtime</p>
              </div>
            </div>
          </>
        )}

        {/* Retake Assessment */}
        <button
          onClick={() => router.push('/onboarding')}
          className="mt-6 w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
            <span className="font-medium text-indigo-600">Retake Assessment</span>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}