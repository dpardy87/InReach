import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	async login(user: any) {
		const payload = { email: user.email, sub: user.userId };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async googleLogin(req: any) {
		if (!req.user) {
			return 'No user from Google';
		}
		return {
			message: 'User information from Google',
			user: req.user,
		};
	}
}