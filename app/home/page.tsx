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
    if (user) {
      console.log('User found on home page, loading data...');
      loadUserData();
      loadTodayMetrics();
    }
  }, [user, router]);

  const loadUserData = async () => {
    if (!user) return;
    // Use email directly from auth session instead of querying database
    if (user.email) {
      setUserName(user.email.split('@')[0]);
    } else {
      setUserName('Demo');
    }
  };

  const loadTodayMetrics = async () => {
    if (!user) return;
    // For demo purposes, set some mock data
    setTodayMetrics({
      reaction_ms: 245,
      mood_score: 8
    });
  };

  const featuredCards = [
    {
      id: 'reaction',
      title: 'Reaction Time',
      icon: '⚡',
      color: 'bg-blue-500',
      value: todayMetrics.reaction_ms ? `${todayMetrics.reaction_ms}` : 'No Data',
      unit: todayMetrics.reaction_ms ? 'ms' : '',
      subtitle: 'Neural response speed',
      detail: 'Today',
      route: '/reaction-test',
      size: 'large'
    },
    {
      id: 'alertness',
      title: 'Alertness Level',
      icon: '🧠',
      color: 'bg-green-500',
      value: todayMetrics.mood_score ? `${todayMetrics.mood_score}` : 'No Data',
      unit: todayMetrics.mood_score ? '/10' : '',
      subtitle: 'Cognitive performance',
      detail: 'Today',
      route: '/alertness',
      size: 'large'
    }
  ];

  const quickAccessCards = [
    {
      id: 'sunrise',
      title: 'Sunrise Plan',
      icon: '☀️',
      color: 'bg-orange-500',
      subtitle: 'Tomorrow',
      route: '/sunrise-plan'
    },
    {
      id: 'trends',
      title: 'Trends',
      icon: '📊',
      color: 'bg-purple-500',
      subtitle: '14 days',
      route: '/trends'
    },
    {
      id: 'chronotype',
      title: 'Chronotype',
      icon: '🌙',
      color: 'bg-indigo-500',
      subtitle: 'Your profile',
      route: '/chronotype'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      color: 'bg-gray-500',
      subtitle: 'Configure',
      route: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100"
         data-version="apple-health-design">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-1">Summary</h1>
            <p className="text-gray-600 text-base font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {userName ? userName[0].toUpperCase() : 'U'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-24 space-y-3">
        {/* Featured Large Cards */}
        {featuredCards.map((card) => (
          <button
            key={card.id}
            onClick={() => router.push(card.route as any)}
            className="w-full bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform duration-150 text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 ${card.color} rounded-md flex items-center justify-center`}>
                  <span className="text-white text-base">{card.icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-black text-base leading-tight">{card.title}</p>
                  <p className="text-gray-500 text-sm">{card.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{card.detail}</p>
              </div>
            </div>
            
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-black">{card.value}</span>
              {card.unit && <span className="text-lg text-gray-500 ml-1">{card.unit}</span>}
            </div>
          </button>
        ))}

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {quickAccessCards.map((card) => (
            <button
              key={card.id}
              onClick={() => router.push(card.route as any)}
              className="bg-white rounded-xl p-4 shadow-sm active:scale-95 transition-transform duration-150 text-left h-20 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className={`w-6 h-6 ${card.color} rounded-md flex items-center justify-center`}>
                  <span className="text-white text-sm">{card.icon}</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-black text-sm leading-tight">{card.title}</p>
                <p className="text-gray-500 text-xs">{card.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Today's Progress Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-black">Today's Goals</h3>
            <div className="text-sm font-medium text-gray-500">
              {(todayMetrics.reaction_ms && todayMetrics.mood_score) ? '2 of 2' : 
               (todayMetrics.reaction_ms || todayMetrics.mood_score) ? '1 of 2' : '0 of 2'}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">⚡</span>
                </div>
                <span className="text-black font-medium text-sm">Reaction Test</span>
              </div>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                todayMetrics.reaction_ms ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {todayMetrics.reaction_ms && <span className="text-white text-xs">✓</span>}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">🧠</span>
                </div>
                <span className="text-black font-medium text-sm">Alertness Check</span>
              </div>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                todayMetrics.mood_score ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {todayMetrics.mood_score && <span className="text-white text-xs">✓</span>}
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
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