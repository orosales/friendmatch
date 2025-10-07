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
          select: { id: true }
        });
        
        await this.prisma.userInterest.createMany({
          data: interestIds.map(interest => ({
            userId: id,
            interestId: interest.id,
          }))
        });
      }
    }
    
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
}

