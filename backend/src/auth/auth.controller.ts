import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Route to initiate Google login
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // GoogleAuthGuard will handle the redirect
  }

  /**
   * Validate user via JWT
   */
  @Get('validate')
  @UseGuards(JwtAuthGuard)
  validateUser(@Req() req: any) {
    return { authenticated: true, user: req.user };
  }

  /**
   * Google login callback
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/login?error=No user from Google');
    }

    const { email, firstName, lastName, picture, userId } = req.user as any;

    if (!email || !userId) {
      console.error('Missing required fields from Google user data:', req.user);
      return res.redirect('/login?error=MissingUserData');
    }

    try {
      // check if the user already exists in the database
      let user = await this.userService.findByGoogleId(userId);
      if (!user) {
        // create new user if they don't exist
        user = await this.userService.createUser({
          googleId: userId,
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          picture: picture || null,
        });
      }

      // generate JWT (use internal user ID)
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload);

      // set the JWT in an HttpOnly cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // redirect to the frontend
      return res.redirect('http://localhost:8080/checkin');
    } catch (error) {
      console.error('Error during Google Auth Redirect:', error);
      return res.redirect('/login?error=InternalServerError');
    }
  }
}
