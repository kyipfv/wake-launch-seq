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
    if (!user) {
      router.push('/');
      return;
    }
    loadUserData();
    loadTodayMetrics();
  }, [user, router]);

  const loadUserData = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setUserName(data.email.split('@')[0]);
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
      <div className="bg-white border-b border-gray-200 px-6 pt-14 pb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-gray-500 text-sm">Welcome back,</p>
            <h1 className="text-3xl font-bold text-gray-900">{userName || 'User'}</h1>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {userName ? userName[0].toUpperCase() : 'U'}
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Health Cards Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {healthCards.map((card) => (
            <button
              key={card.id}
              onClick={() => router.push(card.route)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 text-left"
            >
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                {card.icon}
              </div>
              <div>
                {card.value && (
                  <div className="flex items-baseline mb-1">
                    <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                    <span className="text-lg text-gray-600 ml-1">{card.unit}</span>
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900">{card.title}</p>
                <p className="text-xs text-gray-500">{card.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Summary */}
      <div className="px-4 pb-24">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">⚡</span>
                </div>
                <span className="text-sm text-gray-600">Reaction Test</span>
              </div>
              <span className={`text-sm font-medium ${todayMetrics.reaction_ms ? 'text-green-600' : 'text-gray-400'}`}>
                {todayMetrics.reaction_ms ? '✓ Complete' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🧠</span>
                </div>
                <span className="text-sm text-gray-600">Alertness Check</span>
              </div>
              <span className={`text-sm font-medium ${todayMetrics.mood_score ? 'text-green-600' : 'text-gray-400'}`}>
                {todayMetrics.mood_score ? '✓ Complete' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}