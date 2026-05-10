import { useState, useEffect, useCallback } from 'react';
import { RescueLocation } from '../types/rescue.type';
import { locationService } from '../services/location.service';

/**
 * Hook for address autocomplete searching with debounce.
 */
export function useAddressSearch() {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<RescueLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q || q.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await locationService.searchAddress(q);
      setOptions(results);
    } catch (err) {
      setError('Lỗi khi tìm kiếm địa chỉ');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) search(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, search]);

  return {
    query,
    setQuery,
    options,
    loading,
    error,
    clearOptions: () => setOptions([]),
  };
}
