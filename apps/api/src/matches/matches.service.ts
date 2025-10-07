import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateMatchingScore } from '@meetmates/utils';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUserId?: string) {
    // Get current user (if provided) to compute real match scores
    const currentUser = currentUserId
      ? await this.prisma.user.findUnique({ 
          where: { id: currentUserId },
          include: {
            interests: {
              include: {
                interest: true
              }
            },
            availability: true
          }
        })
      : null;

    // Get all other users with their interests and availability
    const users = await this.prisma.user.findMany({
      where: currentUserId
        ? {
            id: {
              not: currentUserId,
            },
          }
        : undefined,
      include: {
        interests: {
          include: {
            interest: true
          }
        },
        availability: true
      },
    });

    // Compute real matching metrics when we know the current user
    const results = users.map((user) => {
      let score = 0.75; // reasonable default
      let distance = 0;
      let sharedInterests: string[] = [];
      let availabilityOverlap = 0;

      try {
        if (currentUser) {
          // Convert to the format expected by calculateMatchingScore
          const currentUserFormatted = {
            ...currentUser,
            interests: currentUser.interests.map(ui => ui.interest.name),
            availability: this.formatAvailabilityFromDB(currentUser.availability)
          };

          const userFormatted = {
            ...user,
            interests: user.interests.map(ui => ui.interest.name),
            availability: this.formatAvailabilityFromDB(user.availability)
          };

          const matchResult = calculateMatchingScore(
            currentUserFormatted as any,
            userFormatted as any
          );
          score = matchResult.score;
          distance = matchResult.distance;
          sharedInterests = matchResult.sharedInterests;
          availabilityOverlap = matchResult.availabilityOverlap;
        }
      } catch (error) {
        console.error('Error calculating match score:', error);
      }

      return {
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email,
        photoUrl:
          user.photoUrl ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
        interests: user.interests.map(ui => ui.interest.name),
        radiusKm: user.radiusKm || 10,
        age: Math.floor(Math.random() * 20) + 20,
        distance,
        score,
        sharedInterests,
        availabilityOverlap,
        lastActive: 'Recently',
        bio: 'Looking to meet new people and make connections!',
        availability: 'Flexible schedule',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    // Sort by highest score by default
    return results.sort((a, b) => b.score - a.score);
  }

  private formatAvailabilityFromDB(availability: any[]) {
    if (!availability || availability.length === 0) return undefined;

    const formatted: any = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    for (const day of days) {
      const daySlots = availability.filter(slot => slot.dayOfWeek === day);
      if (daySlots.length > 0) {
        formatted[day] = daySlots.map(slot => ({
          start: slot.startTime,
          end: slot.endTime
        }));
      }
    }

    return formatted;
  }
}
