'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import Nav from '@/components/Nav';

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export default function Settings() {
  const { user } = useAuth();
  const router = useRouter();
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('city_name, city_lat, city_lon')
      .eq('id', user.id)
      .single();

    if (data && data.city_name) {
      setSelectedCity({
        name: data.city_name,
        country: '',
        lat: data.city_lat,
        lon: data.city_lon
      });
      setCityQuery(data.city_name);
    }
  };

  const searchCities = async () => {
    if (cityQuery.length < 2) return;

    setLoading(true);
    try {
      // Using OpenWeatherMap Geocoding API (free tier available)
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityQuery)}&limit=5&appid=439d4b804bc8187953eb36d2a8c26a02`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedCities: City[] = data.map((city: any) => ({
          name: city.name,
          country: city.country,
          lat: city.lat,
          lon: city.lon
        }));
        setCities(formattedCities);
      }
    } catch (error) {
      console.error('Error searching cities:', error);
      setMessage('Error searching cities. Please try again.');
    }
    setLoading(false);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCityQuery(`${city.name}, ${city.country}`);
    setCities([]);
  };

  const handleSave = async () => {
    if (!user || !selectedCity) return;

    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({
        city_name: selectedCity.name,
        city_lat: selectedCity.lat,
        city_lon: selectedCity.lon,
      })
      .eq('id', user.id);

    if (error) {
      setMessage('Error saving settings. Please try again.');
      console.error('Error saving settings:', error);
    } else {
      setMessage('Settings saved successfully!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <Nav />
      
      <div className="relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-700/10 to-cyan-500/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 shadow-2xl">
              <div className="text-3xl">⚙️</div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Settings</h1>
            <p className="text-gray-400 text-xl">Configure your wake optimization preferences</p>
          </div>

          {/* Settings Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-800">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Location Settings</h2>
              <p className="text-gray-400">Set your city for accurate sunrise calculations</p>
            </div>

            {message && (
              <div className={`p-4 rounded-2xl mb-6 text-center font-medium ${
                message.includes('successfully') 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search for your city
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchCities()}
                    placeholder="Enter city name..."
                    className="w-full px-6 py-4 bg-gray-800/80 border border-gray-700 rounded-2xl text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    onClick={searchCities}
                    disabled={loading || cityQuery.length < 2}
                    className="absolute right-2 top-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded-xl transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </div>

              {/* City Results */}
              {cities.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Select your city:</p>
                  {cities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleCitySelect(city)}
                      className="w-full p-4 text-left bg-gray-800/60 border border-gray-700 rounded-xl hover:border-purple-500 hover:bg-gray-800/80 transition-all duration-300 text-white group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{city.name}, {city.country}</span>
                        <span className="text-sm text-gray-400">
                          {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected City */}
              {selectedCity && (
                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                  <p className="text-sm text-purple-300 mb-2">Selected location:</p>
                  <p className="text-xl font-semibold text-white mb-1">
                    {selectedCity.name}{selectedCity.country && `, ${selectedCity.country}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    Coordinates: {selectedCity.lat.toFixed(4)}°, {selectedCity.lon.toFixed(4)}°
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                disabled={!selectedCity || saving}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-lg font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {saving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Settings'
                )}
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 text-lg font-semibold rounded-2xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}