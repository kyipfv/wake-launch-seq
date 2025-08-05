'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

interface HealthCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  value?: string;
  unit?: string;
  subtitle?: string;
  route: string;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [todayMetrics, setTodayMetrics] = useState<any>({});
  const [userName, setUserName] = useState('');

  useEffect(() => {
    console.log('Home page useEffect - user:', user?.id, 'pathname:', window.location.pathname);
    if (!user) {
      console.log('No user found on home page, redirecting to /');
      router.push('/');
      return;
    }
    console.log('User found on home page, loading data...');
    loadUserData();
    loadTodayMetrics();
  }, [user, router]);

  const loadUserData = async () => {
    if (!user) return;
    // Use email directly from auth session instead of querying database
    if (user.email) {
      setUserName(user.email.split('@')[0]);
    }
  };

  const loadTodayMetrics = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('metrics')
      .select('reaction_ms, mood_score')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (data) {
      setTodayMetrics(data);
    }
  };

  const healthCards: HealthCard[] = [
    {
      id: 'reaction',
      title: 'Reaction Time',
      icon: '⚡',
      color: 'bg-blue-500',
      value: todayMetrics.reaction_ms ? `${todayMetrics.reaction_ms}` : '—',
      unit: todayMetrics.reaction_ms ? 'ms' : '',
      subtitle: 'Today',
      route: '/reaction-test'
    },
    {
      id: 'alertness',
      title: 'Alertness',
      icon: '🧠',
      color: 'bg-green-500',
      value: todayMetrics.mood_score ? `${todayMetrics.mood_score}` : '—',
      unit: todayMetrics.mood_score ? '/10' : '',
      subtitle: 'Today',
      route: '/alertness'
    },
    {
      id: 'sunrise',
      title: 'Sunrise Plan',
      icon: '☀️',
      color: 'bg-orange-500',
      value: 'View',
      unit: '',
      subtitle: 'Tomorrow',
      route: '/sunrise-plan'
    },
    {
      id: 'trends',
      title: 'Trends',
      icon: '📊',
      color: 'bg-purple-500',
      value: '14',
      unit: 'days',
      subtitle: 'Analysis',
      route: '/trends'
    },
    {
      id: 'chronotype',
      title: 'Chronotype',
      icon: '🌙',
      color: 'bg-indigo-500',
      value: 'Profile',
      unit: '',
      subtitle: 'Your type',
      route: '/chronotype'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      color: 'bg-gray-500',
      value: '',
      unit: '',
      subtitle: 'Configure',
      route: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-500 text-base font-medium">Good morning,</p>
            <h1 className="text-4xl font-bold text-gray-900 -mt-1">{userName || 'User'}</h1>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {userName ? userName[0].toUpperCase() : 'U'}
          </div>
        </div>
        <p className="text-gray-600 text-lg font-medium">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Health Cards Grid */}
      <div className="px-6 pb-32">
        <div className="grid grid-cols-2 gap-4">
          {healthCards.map((card) => (
            <button
              key={card.id}
              onClick={() => router.push(card.route as any)}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 text-left relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute top-0 right-0 w-20 h-20 ${card.color} opacity-5 rounded-full -translate-y-4 translate-x-4`}></div>
              
              <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg relative z-10`}>
                {card.icon}
              </div>
              
              <div className="relative z-10">
                {card.value && (
                  <div className="flex items-baseline mb-2">
                    <span className="text-3xl font-bold text-gray-900 leading-none">{card.value}</span>
                    {card.unit && <span className="text-lg text-gray-500 ml-1 font-medium">{card.unit}</span>}
                  </div>
                )}
                <p className="text-base font-semibold text-gray-900 mb-1">{card.title}</p>
                <p className="text-sm text-gray-500 font-medium">{card.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Progress */}
      <div className="px-6 pb-32">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Today's Progress</h2>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-xl text-white">⚡</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Reaction Test</p>
                  <p className="text-sm text-gray-500">Measure response speed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${todayMetrics.reaction_ms ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className={`text-sm font-semibold ${todayMetrics.reaction_ms ? 'text-green-600' : 'text-gray-400'}`}>
                  {todayMetrics.reaction_ms ? 'Complete' : 'Pending'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-xl text-white">🧠</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Alertness Check</p>
                  <p className="text-sm text-gray-500">Rate energy level</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${todayMetrics.mood_score ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className={`text-sm font-semibold ${todayMetrics.mood_score ? 'text-green-600' : 'text-gray-400'}`}>
                  {todayMetrics.mood_score ? 'Complete' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Daily Goal</span>
              <span className="text-sm font-bold text-gray-900">
                {(todayMetrics.reaction_ms && todayMetrics.mood_score) ? '2/2' : 
                 (todayMetrics.reaction_ms || todayMetrics.mood_score) ? '1/2' : '0/2'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((todayMetrics.reaction_ms ? 1 : 0) + (todayMetrics.mood_score ? 1 : 0)) * 50}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}