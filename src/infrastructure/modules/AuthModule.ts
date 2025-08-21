import { Module } from '@nestjs/common';
import { AuthController } from '../controller/AuthController';
import { AuthService } from '../../application/service/AuthService';
import { PrismaUserRepository } from '../persistence/PrismaUserRepository';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../../shared/env';
import { UserRepository } from '../../domain/port/UserRepository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../config/security/JwtStrategy';

@Module({
  imports: [
    PassportModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: env.JWT_ACCESS_TTL },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
