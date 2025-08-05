import * as SunCalc from 'suncalc';

export interface Location {
  latitude: number;
  longitude: number;
}

export function getSunrise(date: Date, location: Location): Date {
  const times = SunCalc.getTimes(date, location.latitude, location.longitude);
  return times.sunrise;
}

export function getWakeAdvice(
  preferredWakeTime: string,
  sunriseTime: Date
): string {
  const [hours, minutes] = preferredWakeTime.split(':').map(Number);
  const preferredWake = new Date(sunriseTime);
  preferredWake.setHours(hours, minutes, 0, 0);

  if (sunriseTime.getTime() >= preferredWake.getTime()) {
    return `Outdoor walk at sunrise (${sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
  } else {
    return `10k lux lamp within 5 min of wake (${preferredWakeTime})`;
  }
}

export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => reject(error),
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}