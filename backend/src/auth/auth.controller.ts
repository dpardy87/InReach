import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  // route to initiate Google login
  @Get('google')
  @UseGuards(AuthGuard('google')) // triggers Google login
  async googleAuth() {
    // guard will handle the redirect
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  validateUser(@Req() req: any) {
    return { authenticated: true, user: req.user };
  }

  // route to handle the Google login callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/login?error=No user from Google');
    }

    const user = req.user as any;
    const payload = { email: user.email, sub: user.userId };

    try {
      const accessToken = this.jwtService.sign(payload);

      // set  token in an HttpOnly cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true, // Prevent JavaScript access
        secure: true, // Use HTTPS in production
        sameSite: 'strict', // Prevent cross-site requests
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // redirect to the frontend
      return res.redirect(`http://localhost:8080/checkin`);
    } catch (error) {
      console.error('Error generating JWT:', error);
      return res.redirect('/login?error=TokenGenerationFailed');
    }
  }
}
