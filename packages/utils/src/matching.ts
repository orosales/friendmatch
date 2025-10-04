import { User, Interest, Availability } from '@meetmates/types';
import { calculateLocationDistance } from './geo';

/**
 * Calculate Jaccard similarity between two sets of interests
 * @param interests1 First set of interests
 * @param interests2 Second set of interests
 * @returns Similarity score between 0 and 1
 */
export function calculateInterestSimilarity(
  interests1: Interest[],
  interests2: Interest[]
): number {
  if (interests1.length === 0 && interests2.length === 0) return 1;
  if (interests1.length === 0 || interests2.length === 0) return 0;
  
  const set1 = new Set(interests1);
  const set2 = new Set(interests2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Calculate availability overlap between two users
 * @param availability1 First user's availability
 * @param availability2 Second user's availability
 * @returns Overlap score between 0 and 1
 */
export function calculateAvailabilityOverlap(
  availability1: Availability | undefined,
  availability2: Availability | undefined
): number {
  if (!availability1 || !availability2) return 0.5; // Neutral score if no availability data
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  let totalOverlap = 0;
  let totalPossible = 0;
  
  for (const day of days) {
    const slots1 = availability1[day] || [];
    const slots2 = availability2[day] || [];
    
    if (slots1.length === 0 && slots2.length === 0) {
      totalPossible += 1;
      totalOverlap += 1; // Both free all day
      continue;
    }
    
    if (slots1.length === 0 || slots2.length === 0) {
      totalPossible += 1;
      continue; // One is busy all day, no overlap
    }
    
    // Calculate overlap for this day
    const dayOverlap = calculateDayOverlap(slots1, slots2);
    totalOverlap += dayOverlap;
    totalPossible += 1;
  }
  
  return totalPossible > 0 ? totalOverlap / totalPossible : 0;
}

/**
 * Calculate overlap between time slots for a single day
 */
function calculateDayOverlap(
  slots1: Array<{ start: string; end: string }>,
  slots2: Array<{ start: string; end: string }>
): number {
  let totalOverlap = 0;
  let totalTime = 0;
  
  for (const slot1 of slots1) {
    for (const slot2 of slots2) {
      const overlap = calculateTimeSlotOverlap(slot1, slot2);
      totalOverlap += overlap;
    }
    totalTime += timeSlotDuration(slot1);
  }
  
  return totalTime > 0 ? totalOverlap / totalTime : 0;
}

/**
 * Calculate overlap between two time slots
 */
function calculateTimeSlotOverlap(
  slot1: { start: string; end: string },
  slot2: { start: string; end: string }
): number {
  const start1 = timeToMinutes(slot1.start);
  const end1 = timeToMinutes(slot1.end);
  const start2 = timeToMinutes(slot2.start);
  const end2 = timeToMinutes(slot2.end);
  
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  
  return Math.max(0, overlapEnd - overlapStart);
}

/**
 * Calculate duration of a time slot in minutes
 */
function timeSlotDuration(slot: { start: string; end: string }): number {
  return timeToMinutes(slot.end) - timeToMinutes(slot.start);
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Calculate distance score based on user's radius preference
 * @param distance Distance in kilometers
 * @param maxRadius User's maximum radius in kilometers
 * @returns Distance score between 0 and 1 (higher is better)
 */
export function calculateDistanceScore(distance: number, maxRadius: number): number {
  if (distance <= 0) return 1;
  if (distance >= maxRadius) return 0;
  
  // Linear decay from 1 to 0 as distance approaches maxRadius
  return 1 - (distance / maxRadius);
}

/**
 * Calculate overall matching score between two users
 * @param user1 First user
 * @param user2 Second user
 * @returns Overall matching score between 0 and 1
 */
export function calculateMatchingScore(user1: User, user2: User): {
  score: number;
  distance: number;
  sharedInterests: Interest[];
  availabilityOverlap: number;
} {
  // Calculate interest similarity (40% weight)
  const interestSimilarity = calculateInterestSimilarity(user1.interests, user2.interests);
  
  // Calculate distance score (30% weight)
  let distanceScore = 0;
  let distance = 0;
  if (user1.location && user2.location) {
    distance = calculateLocationDistance(user1.location, user2.location);
    distanceScore = calculateDistanceScore(distance, Math.min(user1.radiusKm, user2.radiusKm));
  }
  
  // Calculate availability overlap (30% weight)
  const availabilityOverlap = calculateAvailabilityOverlap(user1.availability, user2.availability);
  
  // Calculate shared interests
  const sharedInterests = user1.interests.filter(interest => 
    user2.interests.includes(interest)
  );
  
  // Weighted average
  const score = (
    interestSimilarity * 0.4 +
    distanceScore * 0.3 +
    availabilityOverlap * 0.3
  );
  
  return {
    score: Math.min(1, Math.max(0, score)),
    distance,
    sharedInterests,
    availabilityOverlap
  };
}

/**
 * Sort users by matching score (highest first)
 */
export function sortUsersByMatchScore<T extends { score: number }>(users: T[]): T[] {
  return [...users].sort((a, b) => b.score - a.score);
}

/**
 * Filter users based on minimum score threshold
 */
export function filterUsersByMinScore<T extends { score: number }>(
  users: T[],
  minScore: number = 0.1
): T[] {
  return users.filter(user => user.score >= minScore);
}
