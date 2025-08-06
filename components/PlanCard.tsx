'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { getSunrise, getWakeAdvice, getCurrentLocation, type Location } from '@/lib/getSunrise';
import { Sun, Cloud, CloudRain, Loader } from 'lucide-react';

interface Plan {
  id?: string;
  date: string;
  sunrise_time: string;
  advice: string;
  weather?: 'sunny' | 'cloudy' | 'rainy';
  recommendation?: 'walk' | 'lightbox';
  completed?: boolean;
  completedAt?: string;
}

export default function PlanCard() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTomorrowsPlan();
      loadUserCity();
    }
  }, [user]);

  const loadUserCity = async () => {
    if (!user) return;
    
    // Handle demo user
    if (user.id === 'demo-user') {
      const savedCity = localStorage.getItem('demo_user_city');
      if (savedCity) {
        const city = JSON.parse(savedCity);
        setUserCity(city.name);
      }
      return;
    }
    
    // Handle real users
    const { data: profile } = await supabase
      .from('profiles')
      .select('city_name')
      .eq('id', user.id)
      .single();
    
    if (profile?.city_name) {
      setUserCity(profile.city_name);
    }
  };

  const getSmartRecommendation = (sunriseTime: Date) => {
    const hour = sunriseTime.getHours();
    
    // Simulate weather conditions (in real app, would use weather API)
    const weatherConditions = ['sunny', 'cloudy', 'rainy'] as const;
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    // Smart recommendation logic
    let recommendation: 'walk' | 'lightbox' = 'walk';
    let reason = '';
    
    if (hour < 6) {
      // Very early sunrise - walk is best
      recommendation = 'walk';
      reason = 'Early sunrise at ' + sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (hour >= 7) {
      // Late sunrise - light box might be better
      recommendation = 'lightbox';
      reason = 'Late sunrise - indoor light therapy recommended';
    } else if (randomWeather === 'rainy') {
      recommendation = 'lightbox';
      reason = 'Rain predicted - indoor light therapy recommended';
    } else if (randomWeather === 'cloudy') {
      recommendation = 'lightbox';
      reason = 'Cloudy conditions - brighter indoor light recommended';
    } else {
      recommendation = 'walk';
      reason = 'Clear morning - perfect for outdoor light exposure';
    }
    
    return { recommendation, reason, weather: randomWeather };
  };

  const loadTomorrowsPlan = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];

      // Check localStorage for completed status (for demo user)
      const completedKey = `plan_completed_${tomorrowDate}`;
      const completedData = localStorage.getItem(completedKey);

      // Handle demo user
      let profile: any = null;
      let location: Location;
      
      if (user.id === 'demo-user') {
        profile = { chrono_window: 'dolphin' };
        
        const savedCity = localStorage.getItem('demo_user_city');
        if (savedCity) {
          const city = JSON.parse(savedCity);
          location = { latitude: city.lat, longitude: city.lon };
        } else {
          location = { latitude: 40.7128, longitude: -74.0060 };
          setError('Please set your city in settings for accurate sunrise times');
        }
      } else {
        const { data } = await supabase
          .from('profiles')
          .select('chrono_window, city_name, city_lat, city_lon')
          .eq('id', user.id)
          .single();
        
        profile = data;
        
        if (!profile?.chrono_window) {
          setError('Please complete your chronotype assessment first');
          setLoading(false);
          return;
        }

        if (profile.city_lat && profile.city_lon) {
          location = { latitude: profile.city_lat, longitude: profile.city_lon };
        } else {
          location = { latitude: 40.7128, longitude: -74.0060 };
          setError('Please set your city in settings for accurate sunrise times');
        }
      }

      const sunriseTime = getSunrise(tomorrow, location);
      const { recommendation, reason, weather } = getSmartRecommendation(sunriseTime);
      
      const advice = recommendation === 'walk' 
        ? '15 minute morning walk' 
        : '20-30 minute light therapy';

      const newPlan = {
        user_id: user.id,
        date: tomorrowDate,
        sunrise_time: sunriseTime.toISOString(),
        advice: `${advice} - ${reason}`,
        weather,
        recommendation,
        completed: completedData ? JSON.parse(completedData).completed : false,
        completedAt: completedData ? JSON.parse(completedData).completedAt : undefined
      };

      setPlan(newPlan);
    } catch (err) {
      console.error('Error loading plan:', err);
      setError('Failed to generate tomorrow\'s plan');
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    if (!plan) return;
    
    setSaving(true);
    const completedAt = new Date().toISOString();
    
    // Update local state
    setPlan({
      ...plan,
      completed: true,
      completedAt
    });
    
    // Save to localStorage for demo user
    if (user?.id === 'demo-user') {
      const completedKey = `plan_completed_${plan.date}`;
      localStorage.setItem(completedKey, JSON.stringify({
        completed: true,
        completedAt,
        activity: plan.recommendation
      }));
      
      // Also save to activity history for trends
      const historyKey = 'demo_activity_history';
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      history.push({
        date: plan.date,
        type: plan.recommendation,
        completedAt,
        sunrise: plan.sunrise_time
      });
      localStorage.setItem(historyKey, JSON.stringify(history));
    } else {
      // Save to database for real users
      // Would implement database save here
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
          <Loader style={{width: '20px', height: '20px', color: '#6b7280', animation: 'spin 1s linear infinite'}} />
          <span style={{color: '#6b7280', fontSize: '16px'}}>Generating tomorrow's plan...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #f3f4f6',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#fee2e2',
          borderRadius: '16px',
          margin: '0 auto 16px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{fontSize: '24px'}}>⚠️</span>
        </div>
        <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>Tomorrow's Plan</h3>
        <p style={{color: '#dc2626', fontSize: '16px', marginBottom: '24px', fontWeight: '500'}}>{error}</p>
      </div>
    );
  }

  if (!plan) return null;

  const sunriseTime = new Date(plan.sunrise_time);
  const WeatherIcon = plan.weather === 'sunny' ? Sun : plan.weather === 'rainy' ? CloudRain : Cloud;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid #f3f4f6',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{marginBottom: '24px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
          <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827'}}>Tomorrow's Launch Sequence</h3>
          {plan.completed && (
            <div style={{
              padding: '6px 12px',
              backgroundColor: '#dcfce7',
              color: '#166534',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>✓</span> Completed
            </div>
          )}
        </div>
        <p style={{fontSize: '16px', color: '#6b7280', fontWeight: '500'}}>
          {new Date(plan.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
          {userCity && ` • ${userCity}`}
        </p>
      </div>

      {/* Sunrise Card */}
      <div style={{
        padding: '24px',
        background: plan.recommendation === 'walk' 
          ? 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)'
          : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderRadius: '16px',
        border: '1px solid ' + (plan.recommendation === 'walk' ? '#fed7aa' : '#bfdbfe'),
        marginBottom: '24px'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
          <div style={{
            width: '64px',
            height: '64px',
            background: plan.recommendation === 'walk'
              ? 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)'
          }}>
            <span style={{fontSize: '28px', color: 'white'}}>
              {plan.recommendation === 'walk' ? '☀️' : '💡'}
            </span>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
              Sunrise: {sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{fontSize: '16px', color: '#6b7280', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <WeatherIcon style={{width: '16px', height: '16px'}} />
              {plan.advice}
            </div>
          </div>
        </div>

        {/* Mission Details */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <h4 style={{fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px'}}>
            Mission Parameters:
          </h4>
          <ul style={{fontSize: '14px', color: '#374151', fontWeight: '500', listStyle: 'none', padding: '0', margin: '0'}}>
            {plan.recommendation === 'walk' ? (
              <>
                <li style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                  <div style={{width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%'}}></div>
                  15 minute morning walk
                </li>
                <li style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                  <div style={{width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%'}}></div>
                  Face east for optimal light
                </li>
                <li style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%'}}></div>
                  No sunglasses for full benefit
                </li>
              </>
            ) : (
              <>
                <li style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                  <div style={{width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
                  10,000 lux light therapy box
                </li>
                <li style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                  <div style={{width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
                  20-30 minutes exposure
                </li>
                <li style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%'}}></div>
                  12-16 inches from face
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Complete Button */}
      {!plan.completed && (
        <button
          onClick={markAsCompleted}
          disabled={saving}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: plan.recommendation === 'walk' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '12px',
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
            opacity: saving ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 0, 0, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.15)';
          }}
        >
          {saving ? 'Saving...' : `Mark ${plan.recommendation === 'walk' ? 'Walk' : 'Light Therapy'} as Complete`}
        </button>
      )}
    </div>
  );
}