import { useState, useCallback } from 'react';
import { RescueLocation } from '../types/rescue.type';
import { locationService } from '../services/location.service';

type GeoStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied';

interface UseCurrentLocationReturn {
  status: GeoStatus;
  location: RescueLocation | null;
  error: string | null;
  getCurrentLocation: () => Promise<RescueLocation | null>;
}

export function useCurrentLocation(): UseCurrentLocationReturn {
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [location, setLocation] = useState<RescueLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback((): Promise<RescueLocation | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setStatus('error');
        setError('Thiết bị không hỗ trợ GPS');
        resolve(null);
        return;
      }

      setStatus('loading');
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const result = await locationService.reverseGeocode(lat, lng);

          setLocation(result);
          setStatus('success');
          resolve(result);
        },
        (err) => {
          const msg = 'Không thể lấy được vị trí hiện tại. Vui lòng nhập địa chỉ thủ công.';
          if (err.code === err.PERMISSION_DENIED) {
            setStatus('denied');
          } else {
            setStatus('error');
          }
          setError(msg);
          resolve(null);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }, []);

  return { status, location, error, getCurrentLocation };
}
