import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable() // marks JwtStrategy as provider (inject wherever necessary)
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // config options
      jwtFromRequest: (req: Request) => {
        // get token from HttpOnly cookie
        const token = req.cookies?.accessToken;
        if (!token) {
          throw new UnauthorizedException('Access token not found');
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // call validate after JWT has been decoded->verified
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
