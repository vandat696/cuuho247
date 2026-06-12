/**
 * Utility functions for geographical calculations.
 */

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function calcDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const radiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getDistanceFromCoordinates(originCoords?: number[], destinationCoords?: number[]): number | null {
  if (!originCoords || !destinationCoords) {
    return null;
  }

  const distanceKm = calcDistanceKm(originCoords[1], originCoords[0], destinationCoords[1], destinationCoords[0]);
  return Math.round(distanceKm * 10) / 10;
}

export function estimateEtaMinutes(distanceKm: number): number {
  const averageUrbanSpeedKmH = 30;
  const dispatchBufferMinutes = 5;
  return Math.max(5, Math.ceil((distanceKm / averageUrbanSpeedKmH) * 60 + dispatchBufferMinutes));
}
