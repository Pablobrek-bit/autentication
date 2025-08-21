import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/modules/PrismaModule';
import { AuthModule } from './infrastructure/modules/AuthModule';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupRefreshTokensJob } from './infrastructure/config/job/CleanupRefreshTokensJob';

@Module({
  imports: [PrismaModule, AuthModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, CleanupRefreshTokensJob],
})
export class AppModule {}
