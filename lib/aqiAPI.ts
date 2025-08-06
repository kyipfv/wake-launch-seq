// Air Quality API utilities
import type { Location } from './getSunrise';

export interface AQIData {
  aqi: number;
  category: string;
  pollutants?: {
    pm25?: number;
    pm10?: number;
    no2?: number;
    o3?: number;
    so2?: number;
    co?: number;
  };
  source?: string;
}

// AQICN (World Air Quality Index) API - Free tier with 1000 calls/day
const AQICN_API_TOKEN = process.env.NEXT_PUBLIC_AQICN_API_KEY || 'demo'; // 'demo' token for testing

export async function fetchRealAQI(location: Location, dateStr: string): Promise<AQIData> {
  const cacheKey = `real_aqi_${dateStr}_${location.latitude.toFixed(2)}_${location.longitude.toFixed(2)}`;
  
  // Check cache first (24 hour cache for AQI data)
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      // Cache for 4 hours (AQI updates frequently)
      if (age < 4 * 60 * 60 * 1000) {
        return data;
      }
    }
  }

  try {
    // Try AQICN API first - most reliable free option
    const aqicnUrl = `https://api.waqi.info/feed/geo:${location.latitude};${location.longitude}/?token=${AQICN_API_TOKEN}`;
    
    const response = await fetch(aqicnUrl);
    const data = await response.json();
    
    if (data.status === 'ok' && data.data?.aqi) {
      const aqi = data.data.aqi;
      const category = getAQICategory(aqi);
      
      const aqiData: AQIData = {
        aqi,
        category,
        pollutants: {
          pm25: data.data.iaqi?.pm25?.v,
          pm10: data.data.iaqi?.pm10?.v,
          no2: data.data.iaqi?.no2?.v,
          o3: data.data.iaqi?.o3?.v,
          so2: data.data.iaqi?.so2?.v,
          co: data.data.iaqi?.co?.v
        },
        source: 'AQICN'
      };

      // Cache the result
      if (typeof window !== 'undefined') {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: aqiData,
          timestamp: Date.now()
        }));
      }

      return aqiData;
    }
  } catch (error) {
    console.warn('AQICN API failed, falling back to OpenWeatherMap:', error);
  }

  // Fallback to OpenWeatherMap Air Pollution API
  try {
    const owmApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!owmApiKey) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const owmUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.latitude}&lon=${location.longitude}&appid=${owmApiKey}`;
    
    const response = await fetch(owmUrl);
    const data = await response.json();
    
    if (data.list && data.list[0]) {
      const airData = data.list[0];
      const aqi = airData.main.aqi * 50; // Convert OWM scale (1-5) to US AQI scale
      const category = getAQICategory(aqi);
      
      const aqiData: AQIData = {
        aqi,
        category,
        pollutants: {
          pm25: airData.components.pm2_5,
          pm10: airData.components.pm10,
          no2: airData.components.no2,
          o3: airData.components.o3,
          so2: airData.components.so2,
          co: airData.components.co
        },
        source: 'OpenWeatherMap'
      };

      // Cache the result
      if (typeof window !== 'undefined') {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: aqiData,
          timestamp: Date.now()
        }));
      }

      return aqiData;
    }
  } catch (error) {
    console.warn('OpenWeatherMap API failed, using fallback:', error);
  }

  // Fallback to realistic simulation based on location
  return getFallbackAQI(location, dateStr);
}

function getFallbackAQI(location: Location, dateStr: string): AQIData {
  // Generate more realistic AQI based on location patterns
  const { latitude, longitude } = location;
  
  // Urban areas tend to have higher pollution
  const isUrban = isUrbanArea(latitude, longitude);
  
  // Use location coordinates and date for consistent but realistic generation
  const locationSeed = Math.abs(Math.sin(latitude * longitude)) * 1000;
  const dateSeed = parseInt(dateStr.replace(/-/g, '').slice(-3));
  const combinedSeed = (locationSeed + dateSeed) % 1000;
  
  let baseAQI: number;
  if (isUrban) {
    // Urban areas: 30-120 AQI typical range
    baseAQI = 30 + (combinedSeed / 1000) * 90;
  } else {
    // Rural areas: 15-80 AQI typical range
    baseAQI = 15 + (combinedSeed / 1000) * 65;
  }
  
  const aqi = Math.floor(baseAQI);
  const category = getAQICategory(aqi);
  
  return {
    aqi,
    category,
    source: 'Estimated'
  };
}

function isUrbanArea(lat: number, lon: number): boolean {
  // Simple urban area detection based on major city coordinates
  const majorCities = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
    { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
    { name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
    { name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
    { name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
    { name: 'Singapore', lat: 1.3521, lon: 103.8198 }
  ];
  
  // Check if within ~100km of any major city
  return majorCities.some(city => {
    const distance = Math.sqrt(
      Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2)
    );
    return distance < 1; // Roughly 100km
  });
}

function getAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}