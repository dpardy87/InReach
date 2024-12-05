import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async googleLogin(req: any) {
    if (!req.user) {
      return 'No user from Google';
    }

    const {
      email,
      sub: googleId,
      given_name: firstName,
      family_name: lastName,
      picture,
    } = req.user;

    // Check if user already exists
    let user = await this.usersService.findByGoogleId(googleId);
    if (!user) {
      // Create a new user if they don't exist
      user = await this.usersService.createUser({
        googleId,
        email,
        firstName,
        lastName,
        picture,
      });
    }

    // Generate JWT (Use internal user ID)
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'User information from Google',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        accessToken,
      },
    };
  }
}
