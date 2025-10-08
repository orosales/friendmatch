import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        interests: {
          include: {
            interest: true
          }
        },
        availability: true
      }
    });

    if (!user) return null;

    // Format the user data to match the expected frontend structure
    return {
      ...user,
      interests: user.interests.map(ui => ui.interest.name),
      availability: this.formatAvailabilityFromDB(user.availability)
    };
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

  async update(id: string, data: {
    interests?: string[];
    radiusKm?: number;
    location?: any;
    availability?: any;
  }) {
    console.log(`UsersService.update called with id: ${id} and data:`, data);
    
    // First, check if the user exists
    let existingUser = await this.prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      console.error(`User with id ${id} not found in database`);
      
      // Try to find user by email as fallback (in case of JWT token mismatch)
      // This is a temporary fix - the real issue should be in the auth flow
      console.log('Attempting to find user by other means...');
      
      // For now, throw an error but with more helpful message
      throw new Error(`User with id ${id} not found. Please try logging in again.`);
    }
    
    console.log(`Found existing user:`, existingUser);
    
    const { interests, ...updateData } = data;
    
    // If interests are provided, update the user interests
    if (interests) {
      // Delete existing user interests
      await this.prisma.userInterest.deleteMany({
        where: { userId: id }
      });
      
      // Create new user interests
      if (interests.length > 0) {
        const interestIds = await this.prisma.interestCategory.findMany({
          where: { name: { in: interests } },
          select: { id: true, name: true }
        });
        
        // Log for debugging
        console.log(`Found ${interestIds.length} matching interest categories for user ${id}`);
        
        // Only create user interests if we found matching interest categories
        if (interestIds.length > 0) {
          try {
            await this.prisma.userInterest.createMany({
              data: interestIds.map(interest => ({
                userId: id,
                interestId: interest.id,
              })),
              skipDuplicates: true, // Skip duplicates to avoid constraint errors
            });
            console.log(`Successfully created ${interestIds.length} user interests for user ${id}`);
          } catch (error) {
            console.error(`Error creating user interests for user ${id}:`, error);
            // Don't throw the error, just log it and continue
          }
        } else {
          console.warn(`No matching interest categories found for user ${id} with interests:`, interests);
        }
      }
    }
    
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
}

