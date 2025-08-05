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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5"></div>
        <div className="relative text-center py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">Live performance tracking</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 tracking-tight">
              Wake optimization
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Track your cognitive performance and optimize your daily wake routine with advanced neural metrics
            </p>
          </div>
        </div>
      </div>

      {/* Modern Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Performance Cards */}
          {featuredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => router.push(card.route as any)}
              className="group cursor-pointer bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Modern Card Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start gap-5">
                  <div className={`w-20 h-20 bg-gradient-to-br ${card.color.replace('bg-', 'from-')} to-${card.color.replace('bg-', '').replace('-500', '-600')} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-3xl filter drop-shadow-sm">{card.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">{card.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{card.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Modern Metrics Display */}
              <div className="mb-8 p-6 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl border border-gray-100/50">
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl font-black text-gray-900 tracking-tight">{card.value}</span>
                  {card.unit && <span className="text-lg text-gray-500 font-medium mb-1">{card.unit}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500 font-medium">{card.detail}</span>
                </div>
              </div>

              {/* Modern Action Buttons */}
              <div className="flex gap-4">
                <div className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl font-semibold text-center group-hover:from-gray-800 group-hover:to-gray-700 transition-all duration-300 shadow-lg shadow-gray-900/20">
                  Start Test
                </div>
                <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-white hover:border-gray-300 transition-all duration-300 shadow-sm">
                  View Details
                </div>
              </div>
            </div>
          ))}

          {/* Quick Access Cards */}
          {quickAccessCards.map((card) => (
            <div
              key={card.id}
              onClick={() => router.push(card.route as any)}
              className="group cursor-pointer bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex items-start gap-5 mb-8">
                <div className={`w-20 h-20 bg-gradient-to-br ${card.color.replace('bg-', 'from-')} to-${card.color.replace('bg-', '').replace('-500', '-600')} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-3xl filter drop-shadow-sm">{card.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">{card.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{card.subtitle}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl font-semibold text-center group-hover:from-gray-800 group-hover:to-gray-700 transition-all duration-300 shadow-lg shadow-gray-900/20">
                  Open
                </div>
                <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-white hover:border-gray-300 transition-all duration-300 shadow-sm">
                  Configure
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Progress Section */}
        <div className="mt-20 bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm border border-white/20 rounded-3xl p-10 shadow-lg shadow-gray-900/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Today's Progress</h2>
            <p className="text-xl text-gray-600">
              {(todayMetrics.reaction_ms && todayMetrics.mood_score) ? (
                <span className="inline-flex items-center gap-2">
                  <span>All goals completed!</span>
                  <span className="text-2xl">🎉</span>
                </span>
              ) : (
                `${(todayMetrics.reaction_ms ? 1 : 0) + (todayMetrics.mood_score ? 1 : 0)} of 2 goals completed`
              )}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white text-2xl filter drop-shadow-sm">⚡</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Reaction Test</h4>
                <p className="text-gray-600">Neural response measurement</p>
              </div>
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shadow-sm ${
                todayMetrics.reaction_ms ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gray-300'
              }`}>
                {todayMetrics.reaction_ms && <span className="text-white font-bold">✓</span>}
              </div>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <span className="text-white text-2xl filter drop-shadow-sm">🧠</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Alertness Check</h4>
                <p className="text-gray-600">Cognitive performance index</p>
              </div>
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shadow-sm ${
                todayMetrics.mood_score ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gray-300'
              }`}>
                {todayMetrics.mood_score && <span className="text-white font-bold">✓</span>}
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