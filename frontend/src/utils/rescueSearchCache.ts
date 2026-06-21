import { RescueSearchState } from '@/types/rescue.type';

// Global memory cache to hold search state and form data.
// This solves the issue where React Router's location.state drops
// or fails to serialize File objects (images) when navigating Back.
let searchStateCache: RescueSearchState | null = null;

export const setRescueSearchCache = (state: RescueSearchState | null) => {
  searchStateCache = state;
};

export const getRescueSearchCache = (): RescueSearchState | null => {
  return searchStateCache;
};

export const clearRescueSearchCache = () => {
  searchStateCache = null;
};
