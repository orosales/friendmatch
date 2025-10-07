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

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
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
    } else {
      // Update existing user
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          photoUrl,
          updatedAt: new Date(),
        },
      });
    }

    return user;
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
