'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { getSunrise, getWakeAdvice, getCurrentLocation, type Location } from '@/lib/getSunrise';

interface Plan {
  id?: string;
  date: string;
  sunrise_time: string;
  advice: string;
}

export default function PlanCard() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTomorrowsPlan();
      loadUserCity();
    }
  }, [user]);

  const loadUserCity = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('city_name')
      .eq('id', user.id)
      .single();
    
    if (profile?.city_name) {
      setUserCity(profile.city_name);
    }
  };

  const loadTomorrowsPlan = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];

      // Check if plan already exists
      const { data: existingPlan } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', tomorrowDate)
        .single();

      if (existingPlan) {
        setPlan(existingPlan);
        setLoading(false);
        return;
      }

      // Get user's chronotype and location
      const { data: profile } = await supabase
        .from('profiles')
        .select('chrono_window, city_name, city_lat, city_lon')
        .eq('id', user.id)
        .single();

      if (!profile?.chrono_window) {
        setError('Please complete your chronotype assessment first');
        setLoading(false);
        return;
      }

      // Get location - prioritize user's saved city, then geolocation, then default
      let location: Location;
      if (profile.city_lat && profile.city_lon) {
        location = { latitude: profile.city_lat, longitude: profile.city_lon };
      } else {
        try {
          location = await getCurrentLocation();
        } catch (geoError) {
          // Fallback to a default location (e.g., New York)
          location = { latitude: 40.7128, longitude: -74.0060 };
          setError('Please set your city in settings for accurate sunrise times');
        }
      }

      const sunriseTime = getSunrise(tomorrow, location);
      const advice = getWakeAdvice(profile.chrono_window.split('-')[0], sunriseTime);

      // Save the plan
      const newPlan = {
        user_id: user.id,
        date: tomorrowDate,
        sunrise_time: sunriseTime.toISOString(),
        advice: advice,
      };

      const { data: savedPlan, error: saveError } = await supabase
        .from('plans')
        .insert(newPlan)
        .select()
        .single();

      if (saveError) {
        throw saveError;
      }

      setPlan(savedPlan);
    } catch (err) {
      console.error('Error loading plan:', err);
      setError('Failed to generate tomorrow\'s plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded-2xl w-1/2 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded-2xl w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-xl w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-xl w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tomorrow's Plan</h3>
        <p className="text-red-600 text-base mb-6 font-medium">{error}</p>
        <button
          onClick={loadTomorrowsPlan}
          className="py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📅</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tomorrow's Plan</h3>
        <p className="text-gray-500 font-medium">No plan available</p>
      </div>
    );
  }

  const sunriseTime = new Date(plan.sunrise_time);
  const isOutdoorAdvice = plan.advice.includes('Outdoor walk');

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 opacity-5 rounded-full -translate-y-4 translate-x-4"></div>
      
      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Tomorrow's Launch Sequence</h3>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-lg">🌅</span>
          </div>
        </div>
        <p className="text-base text-gray-600 font-medium">
          {new Date(plan.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
          {userCity && ` • ${userCity}`}
        </p>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white">
                {isOutdoorAdvice ? '☀️' : '💡'}
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 mb-1">
                Sunrise: {sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-base text-gray-600 font-medium">
                {plan.advice}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg text-white">🎯</span>
            </div>
            <div className="text-lg font-bold text-gray-900">Mission Parameters:</div>
          </div>
          <ul className="text-base space-y-2 text-gray-700 font-medium">
            {isOutdoorAdvice ? (
              <>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Step outside within 5 minutes of sunrise
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Face east for optimal light exposure
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  10-15 minute walk recommended
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Use 10,000 lux light therapy device
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Begin within 5 minutes of wake time
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  20-30 minute exposure duration
                </li>
              </>
            )}
          </ul>
        </div>

        <button
          onClick={loadTomorrowsPlan}
          className="w-full py-3 px-6 bg-white border-2 border-orange-500 text-orange-600 font-semibold rounded-2xl hover:bg-orange-50 hover:scale-105 transition-all duration-200 shadow-sm"
        >
          🔄 Refresh Plan
        </button>
      </div>
    </div>
  );
}