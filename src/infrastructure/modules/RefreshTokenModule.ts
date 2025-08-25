import { Module } from '@nestjs/common';
import { RefreshTokenService } from '../../application/service/RefreshTokenService';
import { RefreshTokenRepository } from '../../domain/port/RefreshTokenRepository';
import { PrismaRefreshTokenRepository } from '../persistence/PrismaRefreshTokenRepository';

@Module({
  providers: [
    RefreshTokenService,
    { provide: RefreshTokenRepository, useClass: PrismaRefreshTokenRepository },
  ],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
