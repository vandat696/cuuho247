import { RescueLocation } from '../types/rescue.type';

/**
 * Service for interacting with OpenStreetMap Nominatim API.
 * Free, no API key required.
 */
export const locationService = {
  /**
   * Search for addresses matching the query.
   */
  async searchAddress(query: string): Promise<RescueLocation[]> {
    if (!query || query.length < 3) return [];

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5&accept-language=vi&countrycodes=vn`
      );
      if (!res.ok) throw new Error('Nominatim search failed');
      const data = await res.json();

      return data.map((item: any) => ({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
    } catch (error) {
      console.error('Error searching address:', error);
      return [];
    }
  },

  /**
   * Reverse geocode coordinates to a readable address.
   */
  async reverseGeocode(lat: number, lng: number): Promise<RescueLocation | null> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`
      );
      if (!res.ok) throw new Error('Nominatim reverse geocode failed');
      const data = await res.json();

      // Build a cleaner address if possible
      const addr = data.address || {};
      const parts: string[] = [];
      if (addr.road || addr.street) parts.push(addr.road || addr.street);
      if (addr.suburb || addr.neighbourhood) parts.push(addr.suburb || addr.neighbourhood);
      if (addr.city_district || addr.district) parts.push(addr.city_district || addr.district);
      if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);

      return {
        address: parts.length > 0 ? parts.join(', ') : data.display_name,
        lat,
        lng,
      };
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return {
        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
      };
    }
  },
};
