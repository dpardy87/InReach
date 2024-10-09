import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // init Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    //return this.authService.googleLogin(req);
    // After successful Google login, we generate a JWT
    if (!req.user) {
      return 'No user from Google';
    }

    const user = req.user;

    // Generate JWT using AuthService or JwtService
    const payload = { email: user.email, sub: user.userId };
    const accessToken = this.jwtService.sign(payload); // Generate JWT

    // Send back the JWT and user info
    return {
      message: 'User information from Google',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        accessToken, // Include the generated JWT here
      },
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
