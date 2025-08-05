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
      // Try OpenWeatherMap API first, fallback to manual entry if it fails
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityQuery)}&limit=5&appid=439d4b804bc8187953eb36d2a8c26a02`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        
        if (data && data.length > 0) {
          const formattedCities: City[] = data.map((city: any) => ({
            name: city.name,
            country: city.country,
            lat: city.lat,
            lon: city.lon
          }));
          setCities(formattedCities);
        } else {
          // No results found, provide some common cities as fallback
          setMessage('No results found. Here are some popular options:');
          setCities([
            { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
            { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
            { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
            { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
            { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437 }
          ]);
        }
      } else {
        console.error('API response not ok:', response.status, response.statusText);
        // Fallback: provide common cities
        setMessage('Location service unavailable. Choose from these options:');
        setCities([
          { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
          { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
          { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
          { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
          { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437 }
        ]);
      }
    } catch (error) {
      console.error('Error searching cities:', error);
      // Fallback: provide common cities
      setMessage('Location service unavailable. Choose from these options:');
      setCities([
        { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
        { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
        { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
        { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
        { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437 }
      ]);
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
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
            <button 
              onClick={() => router.push('/profile')}
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
            <div>
              <h1 style={{fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0'}}>Settings</h1>
              <p style={{color: '#6b7280', fontSize: '16px', fontWeight: '500', marginTop: '4px', margin: '4px 0 0 0'}}>Configure your location</p>
            </div>
          </div>
          
          {/* Icon Display */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #6b7280 0%, #475569 100%)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -3px rgba(107, 114, 128, 0.3), 0 4px 6px -2px rgba(107, 114, 128, 0.05)'
            }}>
              <span style={{fontSize: '40px', color: 'white'}}>⚙️</span>
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
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)'
        }}>
          {/* Background gradient */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '96px',
            height: '96px',
            backgroundColor: '#3b82f6',
            opacity: '0.03',
            borderRadius: '50%',
            transform: 'translate(16px, -16px)'
          }}></div>
          
          <div className="mb-8 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Location Settings</h2>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">📍</span>
              </div>
            </div>
            <p className="text-base text-gray-500 font-medium">Set your city for accurate sunrise calculations</p>
          </div>

          {message && (
            <div className={`p-6 rounded-3xl mb-6 text-center font-semibold relative z-10 ${
              message.includes('successfully') 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 shadow-sm' 
                : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  message.includes('successfully') ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <span className="text-white text-sm">{message.includes('successfully') ? '✓' : '!'}</span>
                </div>
                {message}
              </div>
            </div>
          )}

          <div className="space-y-8 relative z-10">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-4">
                Search for your city
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchCities()}
                  placeholder="Enter city name..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
                <button
                  onClick={searchCities}
                  disabled={loading || cityQuery.length < 2}
                  className="absolute right-3 top-3 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
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
              <div className="space-y-4">
                <p className="text-base font-semibold text-gray-700">Select your city:</p>
                <div className="space-y-3">
                  {cities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleCitySelect(city)}
                      className="w-full p-5 text-left bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 text-gray-900 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-lg font-medium">{city.name}, {city.country}</span>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                          {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected City */}
            {selectedCity && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl text-white">🌆</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-semibold mb-1">Selected location:</p>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {selectedCity.name}{selectedCity.country && `, ${selectedCity.country}`}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Coordinates: {selectedCity.lat.toFixed(4)}°, {selectedCity.lon.toFixed(4)}°
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-8 relative z-10">
            <button
              onClick={handleSave}
              disabled={!selectedCity || saving}
              className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-3xl hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:transform-none shadow-md"
            >
              {saving ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>💾</span>
                  Save Location
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}