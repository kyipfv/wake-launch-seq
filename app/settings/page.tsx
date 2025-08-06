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
  const [showAllCities, setShowAllCities] = useState(false);

  // Comprehensive list of major cities with their coordinates
  const allCities: City[] = [
    // North America
    { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437 },
    { name: 'Chicago', country: 'US', lat: 41.8781, lon: -87.6298 },
    { name: 'Houston', country: 'US', lat: 29.7604, lon: -95.3698 },
    { name: 'Phoenix', country: 'US', lat: 33.4484, lon: -112.0740 },
    { name: 'Philadelphia', country: 'US', lat: 39.9526, lon: -75.1652 },
    { name: 'San Antonio', country: 'US', lat: 29.4241, lon: -98.4936 },
    { name: 'San Diego', country: 'US', lat: 32.7157, lon: -117.1611 },
    { name: 'Dallas', country: 'US', lat: 32.7767, lon: -96.7970 },
    { name: 'San Jose', country: 'US', lat: 37.3382, lon: -121.8863 },
    { name: 'San Francisco', country: 'US', lat: 37.7749, lon: -122.4194 },
    { name: 'Austin', country: 'US', lat: 30.2672, lon: -97.7431 },
    { name: 'Seattle', country: 'US', lat: 47.6062, lon: -122.3321 },
    { name: 'Denver', country: 'US', lat: 39.7392, lon: -104.9903 },
    { name: 'Boston', country: 'US', lat: 42.3601, lon: -71.0589 },
    { name: 'Miami', country: 'US', lat: 25.7617, lon: -80.1918 },
    { name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832 },
    { name: 'Vancouver', country: 'CA', lat: 49.2827, lon: -123.1207 },
    { name: 'Montreal', country: 'CA', lat: 45.5017, lon: -73.5673 },
    { name: 'Mexico City', country: 'MX', lat: 19.4326, lon: -99.1332 },
    
    // Europe
    { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
    { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
    { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 },
    { name: 'Madrid', country: 'ES', lat: 40.4168, lon: -3.7038 },
    { name: 'Barcelona', country: 'ES', lat: 41.3851, lon: 2.1734 },
    { name: 'Rome', country: 'IT', lat: 41.9028, lon: 12.4964 },
    { name: 'Milan', country: 'IT', lat: 45.4642, lon: 9.1900 },
    { name: 'Amsterdam', country: 'NL', lat: 52.3676, lon: 4.9041 },
    { name: 'Vienna', country: 'AT', lat: 48.2082, lon: 16.3738 },
    { name: 'Prague', country: 'CZ', lat: 50.0755, lon: 14.4378 },
    { name: 'Stockholm', country: 'SE', lat: 59.3293, lon: 18.0686 },
    { name: 'Copenhagen', country: 'DK', lat: 55.6761, lon: 12.5683 },
    { name: 'Dublin', country: 'IE', lat: 53.3498, lon: -6.2603 },
    { name: 'Edinburgh', country: 'GB', lat: 55.9533, lon: -3.1883 },
    { name: 'Lisbon', country: 'PT', lat: 38.7223, lon: -9.1393 },
    { name: 'Warsaw', country: 'PL', lat: 52.2297, lon: 21.0122 },
    { name: 'Budapest', country: 'HU', lat: 47.4979, lon: 19.0402 },
    { name: 'Athens', country: 'GR', lat: 37.9838, lon: 23.7275 },
    
    // Asia
    { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
    { name: 'Seoul', country: 'KR', lat: 37.5665, lon: 126.9780 },
    { name: 'Shanghai', country: 'CN', lat: 31.2304, lon: 121.4737 },
    { name: 'Beijing', country: 'CN', lat: 39.9042, lon: 116.4074 },
    { name: 'Hong Kong', country: 'HK', lat: 22.3193, lon: 114.1694 },
    { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198 },
    { name: 'Bangkok', country: 'TH', lat: 13.7563, lon: 100.5018 },
    { name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777 },
    { name: 'Delhi', country: 'IN', lat: 28.6139, lon: 77.2090 },
    { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
    { name: 'Tel Aviv', country: 'IL', lat: 32.0853, lon: 34.7818 },
    { name: 'Istanbul', country: 'TR', lat: 41.0082, lon: 28.9784 },
    
    // Oceania
    { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
    { name: 'Melbourne', country: 'AU', lat: -37.8136, lon: 144.9631 },
    { name: 'Brisbane', country: 'AU', lat: -27.4698, lon: 153.0251 },
    { name: 'Perth', country: 'AU', lat: -31.9505, lon: 115.8605 },
    { name: 'Auckland', country: 'NZ', lat: -36.8485, lon: 174.7633 },
    { name: 'Wellington', country: 'NZ', lat: -41.2865, lon: 174.7762 },
    
    // South America
    { name: 'São Paulo', country: 'BR', lat: -23.5505, lon: -46.6333 },
    { name: 'Rio de Janeiro', country: 'BR', lat: -22.9068, lon: -43.1729 },
    { name: 'Buenos Aires', country: 'AR', lat: -34.6037, lon: -58.3816 },
    { name: 'Santiago', country: 'CL', lat: -33.4489, lon: -70.6693 },
    { name: 'Lima', country: 'PE', lat: -12.0464, lon: -77.0428 },
    { name: 'Bogotá', country: 'CO', lat: 4.7110, lon: -74.0721 },
    
    // Africa
    { name: 'Cairo', country: 'EG', lat: 30.0444, lon: 31.2357 },
    { name: 'Cape Town', country: 'ZA', lat: -33.9249, lon: 18.4241 },
    { name: 'Johannesburg', country: 'ZA', lat: -26.2041, lon: 28.0473 },
    { name: 'Lagos', country: 'NG', lat: 6.5244, lon: 3.3792 },
    { name: 'Nairobi', country: 'KE', lat: -1.2921, lon: 36.8219 }
  ].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    // Check if we're using demo user
    if (user.id === 'demo-user') {
      // Load from localStorage for demo user
      const savedCity = localStorage.getItem('demo_user_city');
      if (savedCity) {
        const city = JSON.parse(savedCity);
        setSelectedCity(city);
        setCityQuery(`${city.name}, ${city.country}`);
      }
      return;
    }

    // Load from database for real users
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

  const searchCities = () => {
    if (cityQuery.length < 2) {
      setCities([]);
      setShowAllCities(false);
      return;
    }

    setLoading(true);
    setMessage('');
    
    // Filter cities based on search query
    const query = cityQuery.toLowerCase();
    const filtered = allCities.filter(city => 
      city.name.toLowerCase().includes(query) ||
      city.country.toLowerCase().includes(query)
    );
    
    if (filtered.length > 0) {
      setCities(filtered.slice(0, 10)); // Show max 10 results
      setShowAllCities(false);
    } else {
      setMessage('No cities found. Try a different search or browse all cities.');
      setCities([]);
    }
    
    setLoading(false);
  };

  // Add useEffect to handle search as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities();
    }, 300); // Debounce search
    
    return () => clearTimeout(timer);
  }, [cityQuery]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCityQuery(`${city.name}, ${city.country}`);
    setCities([]);
    setShowAllCities(false);
    setMessage('');
  };

  const handleSave = async () => {
    if (!user || !selectedCity) return;

    setSaving(true);
    setMessage('');

    try {
      // Handle demo user
      if (user.id === 'demo-user') {
        // Save to localStorage for demo user
        localStorage.setItem('demo_user_city', JSON.stringify(selectedCity));
        setMessage('Settings saved successfully!');
        setTimeout(() => {
          router.push('/home');
        }, 1500);
      } else {
        // Save to database for real users
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
      }
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
      console.error('Error saving settings:', error);
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

          <div style={{position: 'relative', zIndex: '10'}}>
            <div style={{marginBottom: '32px'}}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px'
              }}>
                Search for your city
              </label>
              <div style={{position: 'relative'}}>
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Type city name (e.g., New York, London, Tokyo)..."
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    color: '#111827',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                />
                {loading && (
                  <div style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #3b82f6',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  </div>
                )}
              </div>
              
              {/* Browse all cities button */}
              <button
                onClick={() => {
                  setShowAllCities(!showAllCities);
                  setCities(showAllCities ? [] : allCities.slice(0, 20));
                  setMessage('');
                }}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {showAllCities ? 'Hide city list' : 'Browse all cities'}
              </button>
            </div>

            {/* City Results */}
            {cities.length > 0 && (
              <div style={{marginBottom: '32px'}}>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '16px'
                }}>
                  {showAllCities ? 'Popular cities:' : 'Select your city:'}
                </p>
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  padding: '8px'
                }}>
                  {cities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleCitySelect(city)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        textAlign: 'left',
                        background: 'linear-gradient(135deg, #f9fafb 0%, #eff6ff 100%)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        marginBottom: index < cities.length - 1 ? '8px' : '0',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        color: '#111827'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
                        e.currentTarget.style.borderColor = '#bfdbfe';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb 0%, #eff6ff 100%)';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%'
                          }}></div>
                          <span style={{fontSize: '16px', fontWeight: '500'}}>
                            {city.name}, {city.country}
                          </span>
                        </div>
                        <span style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>
                          {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {showAllCities && cities.length >= 20 && (
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center',
                    marginTop: '12px'
                  }}>
                    Showing first 20 cities. Use search to find more.
                  </p>
                )}
              </div>
            )}

            {/* Selected City */}
            {selectedCity && (
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: '16px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                marginBottom: '32px'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)'
                  }}>
                    <span style={{fontSize: '24px', color: 'white'}}>🌆</span>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      color: '#2563eb',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      Selected location:
                    </p>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {selectedCity.name}{selectedCity.country && `, ${selectedCity.country}`}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
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