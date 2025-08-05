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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTomorrowsPlan();
    }
  }, [user]);

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

      // Get user's chronotype
      const { data: profile } = await supabase
        .from('profiles')
        .select('chrono_window')
        .eq('id', user.id)
        .single();

      if (!profile?.chrono_window) {
        setError('Please complete your chronotype assessment first');
        setLoading(false);
        return;
      }

      // Get location and calculate sunrise
      let location: Location;
      try {
        location = await getCurrentLocation();
      } catch (geoError) {
        // Fallback to a default location (e.g., New York)
        location = { latitude: 40.7128, longitude: -74.0060 };
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
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Tomorrow's Plan</h3>
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={loadTomorrowsPlan}
            className="bg-primary text-black px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Tomorrow's Plan</h3>
          <p className="text-gray-400">No plan available</p>
        </div>
      </div>
    );
  }

  const sunriseTime = new Date(plan.sunrise_time);
  const isOutdoorAdvice = plan.advice.includes('Outdoor walk');

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Tomorrow's Launch Sequence</h3>
        <p className="text-gray-400 text-sm">
          {new Date(plan.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">
              {isOutdoorAdvice ? '☀️' : '💡'}
            </div>
            <div>
              <div className="text-primary font-semibold">
                Sunrise: {sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-gray-300 text-sm">
                {plan.advice}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-4">
          <div className="text-sm text-blue-200">
            <div className="font-semibold mb-1">Mission Parameters:</div>
            <ul className="text-xs space-y-1 text-blue-300">
              {isOutdoorAdvice ? (
                <>
                  <li>• Step outside within 5 minutes of sunrise</li>
                  <li>• Face east for optimal light exposure</li>
                  <li>• 10-15 minute walk recommended</li>
                </>
              ) : (
                <>
                  <li>• Use 10,000 lux light therapy device</li>
                  <li>• Begin within 5 minutes of wake time</li>
                  <li>• 20-30 minute exposure duration</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <button
          onClick={loadTomorrowsPlan}
          className="w-full border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary hover:text-black transition-colors text-sm"
        >
          Refresh Plan
        </button>
      </div>
    </div>
  );
}