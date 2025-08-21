import { Injectable, Logger } from '@nestjs/common';
import type { PrismaService } from '../../../application/service/PrismaService';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupRefreshTokensJob {
  private readonly logger = new Logger(CleanupRefreshTokensJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handle() {
    const now = new Date();
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expires_at: { lt: now } }, { revoked_at: { not: null } }],
      },
    });
    this.logger.log(`Deleted ${result.count} expired refresh tokens`);
  }
}
