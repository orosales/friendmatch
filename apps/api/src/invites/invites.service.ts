import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const invites = await this.prisma.invite.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
          },
        },
        venue: true,
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photoUrl: true,
              },
            },
          },
        },
        interests: {
          include: {
            interest: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the invites to match the expected frontend structure
    return invites.map(invite => ({
      ...invite,
      interests: invite.interests.map(ui => ui.interest.name)
    }));
  }

  async create(createInviteDto: CreateInviteDto) {
    const { ownerId, title, description, interests, startTime, endTime, radiusKm, visibility, venueId, maxAttendees } = createInviteDto;

    // Create the invite first
    const invite = await this.prisma.invite.create({
      data: {
        ownerId,
        title,
        description,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        radiusKm,
        visibility,
        venueId,
        maxAttendees,
      },
    });

    // Add interests to the invite
    if (interests && interests.length > 0) {
      const interestIds = await this.prisma.interestCategory.findMany({
        where: { name: { in: interests } },
        select: { id: true }
      });
      
      await this.prisma.inviteInterest.createMany({
        data: interestIds.map(interest => ({
          inviteId: invite.id,
          interestId: interest.id,
        }))
      });
    }

    // Return the invite with all relations
    const createdInvite = await this.prisma.invite.findUnique({
      where: { id: invite.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
          },
        },
        venue: true,
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photoUrl: true,
              },
            },
          },
        },
        interests: {
          include: {
            interest: true
          }
        },
      },
    });

    // Format the invite to match the expected frontend structure
    return {
      ...createdInvite,
      interests: createdInvite.interests.map(ui => ui.interest.name)
    };
  }
}
