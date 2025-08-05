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
    <div className="min-h-screen bg-white">
      {/* Header - Centered like tinyteams */}
      <div className="text-center py-16 px-6 bg-gray-50 border-b border-gray-100">
        <h1 className="text-5xl font-bold text-black mb-4">Wake optimization dashboard</h1>
        <p className="text-xl text-gray-500 font-normal max-w-2xl mx-auto">
          Track your cognitive performance and optimize your daily wake routine
        </p>
      </div>

      {/* Main Grid - Two column layout like tinyteams */}
      <div className="max-w-6xl mx-auto px-6 py-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Performance Cards */}
          {featuredCards.map((card) => (
            <button
              key={card.id}
              onClick={() => router.push(card.route as any)}
              className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-200 text-left group"
            >
              {/* Logo/Icon area */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 ${card.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <span className="text-white text-2xl">{card.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-base leading-relaxed">{card.subtitle}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm text-gray-500 font-medium">Current:</span>
                  <span className="text-lg font-bold text-black">{card.value}</span>
                  {card.unit && <span className="text-sm text-gray-500">{card.unit}</span>}
                </div>
                <div className="text-sm text-gray-400">{card.detail}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <div className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 group-hover:border-gray-400 transition-colors flex items-center gap-2">
                  <span>View Details</span>
                  <span className="text-xs">↗</span>
                </div>
                <div className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 group-hover:border-gray-400 transition-colors flex items-center gap-2">
                  <span>Start Test</span>
                  <span className="text-xs">↗</span>
                </div>
              </div>
            </button>
          ))}

          {/* Quick Access Cards */}
          {quickAccessCards.map((card) => (
            <button
              key={card.id}
              onClick={() => router.push(card.route as any)}
              className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 ${card.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <span className="text-white text-2xl">{card.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-base leading-relaxed">{card.subtitle}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 group-hover:border-gray-400 transition-colors flex items-center gap-2">
                  <span>View</span>
                  <span className="text-xs">↗</span>
                </div>
                <div className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 group-hover:border-gray-400 transition-colors flex items-center gap-2">
                  <span>Configure</span>  
                  <span className="text-xs">↗</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Progress Summary - Full width */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">Today's Progress</h2>
            <p className="text-gray-500">
              {(todayMetrics.reaction_ms && todayMetrics.mood_score) ? 'All goals completed! 🎉' : 
               `${(todayMetrics.reaction_ms ? 1 : 0) + (todayMetrics.mood_score ? 1 : 0)} of 2 goals completed`}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">⚡</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-black">Reaction Test</h4>
                <p className="text-sm text-gray-500">Neural response measurement</p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                todayMetrics.reaction_ms ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {todayMetrics.reaction_ms && <span className="text-white text-sm">✓</span>}
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🧠</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-black">Alertness Check</h4>
                <p className="text-sm text-gray-500">Cognitive performance index</p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                todayMetrics.mood_score ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {todayMetrics.mood_score && <span className="text-white text-sm">✓</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}