import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MatchesModule } from './matches/matches.module';
import { InvitesModule } from './invites/invites.module';
import { VenuesModule } from './venues/venues.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    MatchesModule,
    InvitesModule,
    VenuesModule,
    AvailabilityModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
