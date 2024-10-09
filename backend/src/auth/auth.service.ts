import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    console.log("logging in...");
    const payload = { email: user.email, sub: user.userId };
    console.log("login payload: ", payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async googleLogin(req: any) {
    if (!req.user) {
      return 'No user from Google';
    }

    const user = req.user;

    // Generate the JWT, ensuring `userId` is part of the payload
    const payload = { email: user.email, sub: user.userId }; // `sub` for userId
    const accessToken = this.jwtService.sign(payload);

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
}
