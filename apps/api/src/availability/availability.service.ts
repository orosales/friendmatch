import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getUserAvailability(userId: string) {
    const availability = await this.prisma.userAvailability.findMany({
      where: { userId },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    // Group by day of week
    const groupedAvailability: { [key: string]: Array<{ start: string; end: string }> } = {};
    
    for (const slot of availability) {
      if (!groupedAvailability[slot.dayOfWeek]) {
        groupedAvailability[slot.dayOfWeek] = [];
      }
      groupedAvailability[slot.dayOfWeek].push({
        start: slot.startTime,
        end: slot.endTime
      });
    }

    return groupedAvailability;
  }

  async updateUserAvailability(userId: string, availability: { [key: string]: Array<{ start: string; end: string }> }) {
    // Delete existing availability
    await this.prisma.userAvailability.deleteMany({
      where: { userId }
    });

    // Create new availability records
    const availabilityData = Object.entries(availability).flatMap(([day, slots]) =>
      slots.map(slot => ({
        userId,
        dayOfWeek: day,
        startTime: slot.start,
        endTime: slot.end,
      }))
    );

    if (availabilityData.length > 0) {
      await this.prisma.userAvailability.createMany({
        data: availabilityData
      });
    }

    return this.getUserAvailability(userId);
  }

  async getInterestCategories() {
    return this.prisma.interestCategory.findMany({
      orderBy: { name: 'asc' }
    });
  }
}
