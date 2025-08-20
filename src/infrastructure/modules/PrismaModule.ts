import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../../application/service/PrismaService';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
