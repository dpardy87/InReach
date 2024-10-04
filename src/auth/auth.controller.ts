import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('google')
	@UseGuards(AuthGuard('google'))	
	async googleAuth(@Req() req) {
		// init Google OAuth
	}

	@Get('google/callback')
  	@UseGuards(AuthGuard('google'))
  	googleAuthRedirect(@Req() req) {
  		return this.authService.googleLogin(req);
  	}

  	@Get('profile')
  	@UseGuards(AuthGuard('jwt'))
  	getProfile(@Req() req) {
  		return req.user
  	}
}