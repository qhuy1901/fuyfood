import { useEffect, useState } from 'react';

export function useLocation() {
  const [locationText, setLocationText] = useState(
    '2-17-8 Kabukicho, Tower B 1205, Shinjuku District, Tokyo 160-0021'
  );
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&accept-language=en`;
          const res = await fetch(url, { headers: { Accept: 'application/json' } });

          if (res.ok) {
            const data = await res.json();
            const place = data?.address;
            const displayName = data?.display_name;
            let parts: string[] = [];

            if (displayName) {
              // Use display_name as a fallback if specific parts are missing
              setLocationText(displayName);
            }
            else if (place) {
              // Prioritize: road/building, suburb/district, city, state
              const road = place.road || place.pedestrian || place.footway || place.neighbourhood;
              const house = place.house_number;
              const suburb = place.suburb || place.city_district || place.district;
              const city = place.city || place.town || place.village;
              const state = place.state;

              if (house && road) {
                parts.push(`${road} ${house}`);
              } else if (road) {
                parts.push(road);
              }

              if (suburb && suburb !== road && suburb !== city) {
                parts.push(suburb);
              }

              if (city && city !== suburb) {
                parts.push(city);
              }

              if (state && state !== city) {
                parts.push(state);
              }
              if (parts.length > 0) {
                setLocationText(parts.join(', '));
              }
            }
          }
        } catch (error) {
          console.warn('Reverse geocode error:', error);
        }
        setLoadingLocation(false);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  }, []);

  return { locationText, loadingLocation };
}