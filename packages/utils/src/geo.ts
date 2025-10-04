import { Location } from '@meetmates/types';

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two Location objects
 */
export function calculateLocationDistance(location1: Location, location2: Location): number {
  return calculateDistance(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );
}

/**
 * Generate a geohash for a given latitude and longitude
 * This is a simplified implementation - in production, use a proper geohash library
 */
export function generateGeohash(latitude: number, longitude: number, precision: number = 8): string {
  const latRange = [-90, 90];
  const lonRange = [-180, 180];
  
  let geohash = '';
  let isEven = true;
  let bit = 0;
  let ch = 0;
  
  let latMin = latRange[0];
  let latMax = latRange[1];
  let lonMin = lonRange[0];
  let lonMax = lonRange[1];
  
  while (geohash.length < precision) {
    if (isEven) {
      const lonMid = (lonMin + lonMax) / 2;
      if (longitude >= lonMid) {
        ch |= (1 << (4 - bit));
        lonMin = lonMid;
      } else {
        lonMax = lonMid;
      }
    } else {
      const latMid = (latMin + latMax) / 2;
      if (latitude >= latMid) {
        ch |= (1 << (4 - bit));
        latMin = latMid;
      } else {
        latMax = latMid;
      }
    }
    
    isEven = !isEven;
    
    if (bit < 4) {
      bit++;
    } else {
      geohash += base32[ch];
      bit = 0;
      ch = 0;
    }
  }
  
  return geohash;
}

const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';

/**
 * Check if two locations are within a specified radius
 */
export function isWithinRadius(
  location1: Location,
  location2: Location,
  radiusKm: number
): boolean {
  const distance = calculateLocationDistance(location1, location2);
  return distance <= radiusKm;
}

/**
 * Calculate the bounding box for a given center point and radius
 */
export function calculateBoundingBox(
  latitude: number,
  longitude: number,
  radiusKm: number
): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  const R = 6371; // Earth's radius in kilometers
  const latDelta = radiusKm / R * (180 / Math.PI);
  const lonDelta = radiusKm / R * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
  
  return {
    north: latitude + latDelta,
    south: latitude - latDelta,
    east: longitude + lonDelta,
    west: longitude - lonDelta
  };
}

/**
 * Get the approximate center of a bounding box
 */
export function getBoundingBoxCenter(boundingBox: {
  north: number;
  south: number;
  east: number;
  west: number;
}): { latitude: number; longitude: number } {
  return {
    latitude: (boundingBox.north + boundingBox.south) / 2,
    longitude: (boundingBox.east + boundingBox.west) / 2
  };
}
