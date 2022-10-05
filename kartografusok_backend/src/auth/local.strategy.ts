import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from "@nestjs/common/exceptions"
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
        usernameField: 'userName',
        passwordField: 'password'
    });
  }

  async validate(userName: string, password: string): Promise<any> {
    const user = await this.authService.getUserByUserNameAndPassword({
        userName,
        password
    });
    if (!user) {
      throw new UnauthorizedException("A felhasználónév vagy a jelszó hibás.");
    }
    return user;
  }
}