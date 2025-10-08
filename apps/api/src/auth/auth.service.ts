import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateOAuthUser(oauthUser: any) {
    const { email, name, photoUrl } = oauthUser;
    console.log(`AuthService.validateOAuthUser called with email: ${email}, name: ${name}`);

    if (!email || !name) {
      throw new Error('Invalid OAuth user data: missing email or name');
    }

    try {
      // Check if user exists
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log(`Creating new user for email: ${email}`);
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email,
            name,
            photoUrl,
            provider: 'google',
            verified: true,
            radiusKm: 10,
          },
        });
        console.log(`Created new user with id: ${user.id}`);
      } else {
        console.log(`Found existing user with id: ${user.id}`);
        // Update existing user
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            name,
            photoUrl,
            updatedAt: new Date(),
          },
        });
        console.log(`Updated existing user with id: ${user.id}`);
      }

      if (!user || !user.id) {
        throw new Error('Failed to create or retrieve user from database');
      }

      return user;
    } catch (error) {
      console.error('Error in validateOAuthUser:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to validate OAuth user: ${errorMessage}`);
    }
  }

  async generateToken(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      name: user.name 
    };
    return this.jwtService.sign(payload);
  }
}
