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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-60 left-16 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
        <div className="absolute bottom-32 right-20 w-1 h-1 bg-emerald-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}></div>
      </div>

      {/* Header with Glassmorphism */}
      <div className="relative z-10 px-6 pt-16 pb-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 relative overflow-hidden">
          {/* Header background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-slate-600 text-base font-medium tracking-wide">Good morning,</p>
              </div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 -mt-1 tracking-tight">
                {userName || 'User'}
              </h1>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-40 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl border-4 border-white/30">
                {userName ? userName[0].toUpperCase() : 'U'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm">📅</span>
            </div>
            <p className="text-slate-700 text-lg font-semibold">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Health Cards Grid with Advanced Styling */}
      <div className="relative z-10 px-6 pb-32">
        <div className="grid grid-cols-2 gap-6">
          {healthCards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => router.push(card.route as any)}
              className="group bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 text-left relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Dynamic background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color.replace('bg-', 'from-')}/5 ${card.color.replace('bg-', 'to-')}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700`}></div>
              
              {/* Floating icon with enhanced styling */}
              <div className={`relative w-20 h-20 ${card.color} rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/30`}>
                <div className={`absolute inset-0 ${card.color} rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                <span className="relative z-10 text-white filter drop-shadow-lg">{card.icon}</span>
              </div>
              
              <div className="relative z-10">
                {card.value && (
                  <div className="flex items-baseline mb-3 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 leading-none tracking-tight">
                      {card.value}
                    </span>
                    {card.unit && (
                      <span className="text-xl text-slate-500 ml-2 font-bold tracking-wide">
                        {card.unit}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-lg font-black text-slate-900 mb-2 tracking-wide">{card.title}</p>
                <p className="text-sm text-slate-600 font-semibold tracking-wide">{card.subtitle}</p>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Progress with Futuristic Design */}
      <div className="relative z-10 px-6 pb-32">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">Today's Progress</h2>
              <p className="text-slate-600 font-semibold mt-1">Neural optimization metrics</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/30">
                <span className="text-2xl text-white filter drop-shadow-lg">📊</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                      <span className="text-2xl text-white filter drop-shadow-lg">⚡</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg tracking-wide">Reaction Test</p>
                    <p className="text-slate-600 font-semibold">Neural response optimization</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${todayMetrics.reaction_ms ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-slate-300'} shadow-lg`}></div>
                  <span className={`text-sm font-black tracking-wide ${todayMetrics.reaction_ms ? 'text-green-600' : 'text-slate-400'}`}>
                    {todayMetrics.reaction_ms ? 'COMPLETE' : 'PENDING'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                      <span className="text-2xl text-white filter drop-shadow-lg">🧠</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg tracking-wide">Alertness Check</p>
                    <p className="text-slate-600 font-semibold">Cognitive performance index</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${todayMetrics.mood_score ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-slate-300'} shadow-lg`}></div>
                  <span className={`text-sm font-black tracking-wide ${todayMetrics.mood_score ? 'text-green-600' : 'text-slate-400'}`}>
                    {todayMetrics.mood_score ? 'COMPLETE' : 'PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-lg font-black text-slate-900 tracking-wide">Daily Optimization</span>
                <p className="text-slate-600 font-semibold text-sm">Neural enhancement protocol</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {(todayMetrics.reaction_ms && todayMetrics.mood_score) ? '2/2' : 
                   (todayMetrics.reaction_ms || todayMetrics.mood_score) ? '1/2' : '0/2'}
                </span>
                <p className="text-slate-600 font-semibold text-sm">Tasks complete</p>
              </div>
            </div>
            <div className="relative w-full h-4 bg-slate-200/50 rounded-full shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-200/30 to-slate-300/30 rounded-full"></div>
              <div 
                className="relative h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full shadow-lg transition-all duration-700 ease-out"
                style={{ 
                  width: `${((todayMetrics.reaction_ms ? 1 : 0) + (todayMetrics.mood_score ? 1 : 0)) * 50}%` 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                <div className="absolute right-0 top-0 h-4 w-4 bg-white/40 rounded-full transform translate-x-2 shadow-lg"></div>
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