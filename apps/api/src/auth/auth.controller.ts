import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This will redirect to Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as any;
      console.log('Google OAuth callback received user:', user);
      
      // Create or find user in database
      const dbUser = await this.authService.validateOAuthUser(user);
      console.log('Database user after validation:', dbUser);
      
      if (!dbUser || !dbUser.id) {
        throw new Error('Failed to create or find user in database');
      }
      
      // Generate JWT token
      const token = await this.authService.generateToken(dbUser);
      console.log('Generated JWT token for user:', dbUser.id);
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=google`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
      res.redirect(`${frontendUrl}/auth/callback?error=authentication_failed`);
    }
  }

  @Get('facebook')
  async facebookAuth(@Res() res: Response) {
    // For now, redirect to a simple demo page
    // In production, this would redirect to Facebook OAuth
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    res.redirect(`${frontendUrl}/auth/callback?token=demo-token&provider=facebook`);
  }

  @Get('facebook/callback')
  async facebookAuthCallback(@Req() req: Request, @Res() res: Response) {
    // This would handle the actual Facebook OAuth callback
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    res.redirect(`${frontendUrl}/auth/callback?token=demo-token&provider=facebook`);
  }
}
