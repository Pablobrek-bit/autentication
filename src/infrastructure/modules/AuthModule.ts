import { Module } from '@nestjs/common';
import { AuthController } from '../controller/AuthController';
import { AuthService } from '../../application/service/AuthService';
import { PrismaUserRepository } from '../persistence/PrismaUserRepository';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../../shared/env';
import { UserRepository } from '../../domain/port/UserRepository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../config/security/JwtStrategy';
import { GoogleStrategy } from '../config/security/GoogleStrategy';
import { OAuthAccountModule } from './OAuthAccountModule';
import { RefreshTokenModule } from './RefreshTokenModule';

@Module({
  imports: [
    PassportModule,
    OAuthAccountModule,
    RefreshTokenModule,
    JwtModule.register({
      secret: env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: env.JWT_ACCESS_TTL },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    GoogleStrategy,
    AuthService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
