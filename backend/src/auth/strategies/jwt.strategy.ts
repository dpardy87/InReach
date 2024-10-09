import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable() // marks JwtStrategy as provider (inject wherever necessary)
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // config options
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // call validate after JWT has been decoded->verified
  async validate(payload: any) {
    console.log('JWT Payload:', payload); // Debugging
    return { userId: payload.sub, email: payload.email };
  }
}
