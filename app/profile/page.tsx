'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const menuItems = [
    {
      label: 'Chronotype',
      value: profile.chrono_window || 'Not set',
      icon: '🌙',
      color: 'bg-indigo-100',
      route: '/chronotype'
    },
    {
      label: 'Location',
      value: profile.city_name || 'Not set',
      icon: '📍',
      color: 'bg-purple-100',
      route: '/settings'
    },
    {
      label: 'Notifications',
      value: 'Off',
      icon: '🔔',
      color: 'bg-blue-100',
      route: '#'
    },
    {
      label: 'Privacy',
      value: '',
      icon: '🔒',
      color: 'bg-green-100',
      route: '#'
    },
    {
      label: 'Help',
      value: '',
      icon: '❓',
      color: 'bg-orange-100',
      route: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 pt-14 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.push('/home')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6 pb-24">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => item.route !== '#' && router.push(item.route as any)}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              disabled={item.route === '#'}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  {item.value && (
                    <p className="text-xs text-gray-500">{item.value}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut()}
          className="mt-6 w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🚪</span>
            </div>
            <span className="font-medium text-red-600">Sign Out</span>
          </div>
        </button>

        {/* App Version */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Wake Launch Sequence</p>
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}