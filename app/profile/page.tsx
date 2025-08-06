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
    
    // Handle demo user
    if (user.id === 'demo-user') {
      const savedCity = localStorage.getItem('demo_user_city');
      if (savedCity) {
        const city = JSON.parse(savedCity);
        setProfile({ city_name: `${city.name}, ${city.country}` });
      }
      return;
    }
    
    // Handle real users
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
      iconBg: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
      route: '/chronotype'
    },
    {
      label: 'Location',
      value: profile.city_name || 'Not set',
      icon: '📍',
      iconBg: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
      route: '/settings'
    },
    {
      label: 'Notifications',
      value: 'Off',
      icon: '🔔',
      iconBg: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      route: '#'
    },
    {
      label: 'Privacy',
      value: '',
      icon: '🔒',
      iconBg: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      route: '#'
    },
    {
      label: 'Help',
      value: '',
      icon: '❓',
      iconBg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      route: '#'
    }
  ];

  const userName = user?.id === 'demo-user' ? 'Demo' : user?.email?.split('@')[0] || 'User';

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '24px 24px 32px 24px',
        paddingTop: '64px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'}}>
            <button 
              onClick={() => router.push('/home')}
              style={{
                padding: '12px',
                marginLeft: '-12px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '50%',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ArrowLeft style={{width: '24px', height: '24px', color: '#111827'}} />
            </button>
            <h1 style={{fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0'}}>Profile</h1>
          </div>

          {/* Profile Info Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '24px',
            backgroundColor: '#f9fafb',
            borderRadius: '16px',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '700',
              color: 'white',
              boxShadow: '0 10px 25px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.05)'
            }}>
              {userName[0].toUpperCase()}
            </div>
            <div>
              <h2 style={{fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
                {userName}
              </h2>
              <p style={{fontSize: '16px', color: '#6b7280', fontWeight: '500'}}>
                {user?.email || 'demo@example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px 128px 24px'
      }}>
        {/* Menu Items */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => item.route !== '#' && router.push(item.route as any)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                backgroundColor: 'white',
                border: 'none',
                borderBottom: index !== menuItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                transition: 'background-color 0.2s ease',
                cursor: item.route !== '#' ? 'pointer' : 'default',
                opacity: item.route === '#' ? 0.6 : 1
              }}
              disabled={item.route === '#'}
              onMouseEnter={(e) => {
                if (item.route !== '#') {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: item.iconBg,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)'
                }}>
                  <span style={{fontSize: '20px'}}>{item.icon}</span>
                </div>
                <div style={{textAlign: 'left'}}>
                  <p style={{fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0'}}>
                    {item.label}
                  </p>
                  {item.value && (
                    <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
              {item.route !== '#' && (
                <ChevronRight style={{width: '20px', height: '20px', color: '#9ca3af'}} />
              )}
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
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #fee2e2 100%)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
          <p style={{fontSize: '12px', color: '#9ca3af', marginBottom: '4px'}}>Wake Launch Sequence</p>
          <p style={{fontSize: '12px', color: '#9ca3af'}}>Version 1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}