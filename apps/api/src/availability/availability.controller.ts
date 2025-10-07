import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getUserAvailability(@Query('userId') userId: string) {
    return this.availabilityService.getUserAvailability(userId);
  }

  @Post()
  async updateUserAvailability(
    @Body() body: { userId: string; availability: { [key: string]: Array<{ start: string; end: string }> } }
  ) {
    return this.availabilityService.updateUserAvailability(body.userId, body.availability);
  }

  @Get('interests')
  async getInterestCategories() {
    return this.availabilityService.getInterestCategories();
  }
}
