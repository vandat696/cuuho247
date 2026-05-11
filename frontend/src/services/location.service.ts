import { RescueLocation } from '../types/rescue.type';

/**
 * Service for interacting with Goong REST API.
 */
const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;

export const locationService = {
  /**
   * Search for addresses matching the query using Goong Autocomplete.
   */
  async searchAddress(query: string): Promise<RescueLocation[]> {
    if (!query) return [];

    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error('Goong autocomplete failed');
      const data = await res.json();

      if (data.status !== 'OK' || !data.predictions) return [];

      return data.predictions.map((item: any) => ({
        address: item.description,
        placeId: item.place_id,
        lat: 0,
        lng: 0,
      }));
    } catch (error) {
      console.error('Error searching address with Goong:', error);
      return [];
    }
  },

  /**
   * Get detailed location information (lat/lng) for a place ID.
   */
  async getPlaceDetail(placeId: string): Promise<RescueLocation | null> {
    try {
      const res = await fetch(`https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${GOONG_API_KEY}`);
      if (!res.ok) throw new Error('Goong place detail failed');
      const data = await res.json();

      if (data.status !== 'OK' || !data.result) return null;

      const { location } = data.result.geometry;
      return {
        address: data.result.formatted_address,
        lat: location.lat,
        lng: location.lng,
        placeId: placeId,
      };
    } catch (error) {
      console.error('Error getting Goong place detail:', error);
      return null;
    }
  },

  /**
   * Reverse geocode coordinates to a readable address using Goong.
   */
  async reverseGeocode(lat: number, lng: number): Promise<RescueLocation | null> {
    try {
      const res = await fetch(`https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_API_KEY}`);
      if (!res.ok) throw new Error('Goong reverse geocode failed');
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        return {
          address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          lat,
          lng,
        };
      }

      return {
        address: data.results[0].formatted_address,
        lat,
        lng,
      };
    } catch (error) {
      console.error('Error reverse geocoding with Goong:', error);
      return {
        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
      };
    }
  },
};
