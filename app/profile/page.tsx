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
          style={{
            marginTop: '24px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: '1px solid #f3f4f6',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.25)'
            }}>
              <span style={{fontSize: '24px', color: 'white'}}>🚪</span>
            </div>
            <div style={{textAlign: 'left'}}>
              <span style={{fontSize: '18px', fontWeight: '700', color: '#dc2626'}}>Sign Out</span>
              <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: '4px 0 0 0'}}>End your session</p>
            </div>
          </div>
        </button>

        {/* App Version */}
        <div style={{marginTop: '32px', textAlign: 'center'}}>
          <p style={{fontSize: '12px', color: '#9ca3af'}}>Wake Launch Sequence</p>
          <p style={{fontSize: '12px', color: '#9ca3af'}}>Version 1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}