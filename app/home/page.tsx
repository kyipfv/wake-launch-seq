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

  const allCards = [
    {
      id: 'reaction',
      title: 'Reaction Time',
      icon: '⚡',
      color: 'bg-blue-500',
      description: `Neural response speed. ${todayMetrics.reaction_ms ? `${todayMetrics.reaction_ms}ms` : 'No data recorded'} today with cognitive optimization tracking`,
      team: todayMetrics.reaction_ms ? `Current: ${todayMetrics.reaction_ms}ms` : 'No data',
      metric: todayMetrics.reaction_ms ? `${todayMetrics.reaction_ms}ms AVG` : 'No data',
      route: '/reaction-test'
    },
    {
      id: 'alertness',
      title: 'Alertness Level',
      icon: '🧠',
      color: 'bg-green-500',
      description: `Cognitive performance tracking. ${todayMetrics.mood_score ? `${todayMetrics.mood_score}/10` : 'No rating recorded'} today with neural enhancement monitoring`,
      team: todayMetrics.mood_score ? `Current: ${todayMetrics.mood_score}/10` : 'No data',
      metric: todayMetrics.mood_score ? `${todayMetrics.mood_score}/10 SCORE` : 'No data',
      route: '/alertness'
    },
    {
      id: 'sunrise',
      title: 'Sunrise Plan',
      icon: '☀️',
      color: 'bg-orange-500',
      description: 'Circadian rhythm optimization. Plan tomorrow\'s wake sequence with personalized light exposure timing',
      team: 'Schedule: Tomorrow',
      metric: 'OPTIMIZER',
      route: '/sunrise-plan'
    },
    {
      id: 'trends',
      title: 'Performance Trends',
      icon: '📊',
      color: 'bg-purple-500',
      description: 'Long-term cognitive analytics. Track performance patterns over 14 days with trend analysis',
      team: 'Period: 14 days',
      metric: 'ANALYTICS',
      route: '/trends'
    },
    {
      id: 'chronotype',
      title: 'Chronotype Profile',
      icon: '🌙',
      color: 'bg-indigo-500',
      description: 'Personal circadian assessment. Determine your optimal sleep-wake cycle based on behavioral patterns',
      team: 'Status: Complete',
      metric: 'PROFILE',
      route: '/chronotype'
    },
    {
      id: 'settings',
      title: 'Configuration',
      icon: '⚙️',
      color: 'bg-gray-500',
      description: 'System preferences and location settings. Configure app behavior and personal optimization parameters',
      team: 'Access: Available',
      metric: 'SETTINGS',
      route: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header exactly like tinyteams */}
      <div className="text-center py-16 px-6 bg-gray-50">
        <h1 className="text-5xl font-bold text-black mb-4">Wake optimization hall of fame</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Directory of the most epic cognitive performance tools
        </p>
        
        {/* Filter buttons like tinyteams */}
        <div className="flex justify-center gap-4 mt-8">
          <div className="px-6 py-3 bg-black text-white rounded-lg font-medium">
            Default
          </div>
          <div className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-colors">
            Performance ↓
          </div>
          <div className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-colors">
            Metrics ↓
          </div>
        </div>
      </div>

      {/* 3x2 Grid exactly like tinyteams */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allCards.map((card) => (
            <button
              key={card.id}
              onClick={() => router.push(card.route as any)}
              className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left"
            >
              {/* Logo and title section */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 ${card.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <span className="text-white text-2xl">{card.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-base leading-relaxed">{card.description}</p>
                </div>
              </div>

              {/* Team and metric info */}
              <div className="mb-6">
                <div className="flex items-center gap-8 text-sm">
                  <span className="text-gray-700 font-medium">{card.team}</span>
                  <span className="text-gray-700 font-medium">{card.metric}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <div className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors flex items-center gap-2">
                  <span>View Jobs</span>
                  <span className="text-xs">↗</span>
                </div>
                <div className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors flex items-center gap-2">
                  <span>View Website</span>
                  <span className="text-xs">↗</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}