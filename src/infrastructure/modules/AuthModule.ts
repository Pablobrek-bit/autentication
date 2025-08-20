import { Module } from '@nestjs/common';
import { AuthController } from '../controller/AuthController';
import { AuthService } from '../../application/service/AuthService';
import { PrismaUserRepository } from '../persistence/PrismaUserRepository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
