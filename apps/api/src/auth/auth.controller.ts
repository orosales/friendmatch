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
    const user = req.user as any;
    
    // Create or find user in database
    const dbUser = await this.authService.validateOAuthUser(user);
    
    // Generate JWT token
    const token = await this.authService.generateToken(dbUser);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=google`);
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
