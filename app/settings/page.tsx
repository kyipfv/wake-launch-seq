'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

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
      // Using OpenWeatherMap Geocoding API
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
        router.push('/home');
      }, 1500);
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 pt-14 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => router.push('/profile')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-600">Configure your location</p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Location Settings</h2>
            <p className="text-sm text-gray-500">Set your city for accurate sunrise calculations</p>
          </div>

          {message && (
            <div className={`p-4 rounded-2xl mb-6 text-center font-medium ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-600 border border-green-200' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search for your city
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchCities()}
                  placeholder="Enter city name..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={searchCities}
                  disabled={loading || cityQuery.length < 2}
                  className="absolute right-2 top-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200"
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
                <p className="text-sm text-gray-600">Select your city:</p>
                {cities.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleCitySelect(city)}
                    className="w-full p-4 text-left bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-gray-900 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{city.name}, {city.country}</span>
                      <span className="text-sm text-gray-500">
                        {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected City */}
            {selectedCity && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-600 mb-2">Selected location:</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  {selectedCity.name}{selectedCity.country && `, ${selectedCity.country}`}
                </p>
                <p className="text-sm text-gray-600">
                  Coordinates: {selectedCity.lat.toFixed(4)}°, {selectedCity.lon.toFixed(4)}°
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={!selectedCity || saving}
              className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {saving ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Location'
              )}
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}