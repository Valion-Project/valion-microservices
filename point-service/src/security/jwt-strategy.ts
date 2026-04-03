import {Injectable} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'Secret_Key_Valion_Back_022506'
    });
  }

  async validate(payload: any) {
    if (payload.type === undefined) {
      return { id: payload.sub };
    } else {
      return { id: payload.sub, type: payload.type, userProfileId: payload.userProfileId };
    }
  }
}