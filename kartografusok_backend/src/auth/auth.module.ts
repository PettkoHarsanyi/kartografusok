import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/users/entity/user';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
import { secret } from './secret';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    MikroOrmModule.forFeature({entities: [User]}),
    PassportModule,
    JwtModule.register({
      secret,
      // signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
