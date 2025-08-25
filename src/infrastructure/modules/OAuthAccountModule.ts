import { Module } from '@nestjs/common';
import { OAuthAccountService } from '../../application/service/OAuthAccountService';
import { OAuthAccountRepository } from '../../domain/port/OAuthAccountRepository';
import { PrismaOAuthAccountRepository } from '../persistence/PrismaOAuthAccountRepository';

@Module({
  providers: [
    OAuthAccountService,
    { provide: OAuthAccountRepository, useClass: PrismaOAuthAccountRepository },
  ],
  exports: [OAuthAccountService],
})
export class OAuthAccountModule {}
