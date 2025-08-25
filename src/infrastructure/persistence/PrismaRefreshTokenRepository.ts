import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../application/service/PrismaService';
import type { RefreshTokenRepository } from '../../domain/port/RefreshTokenRepository';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRefreshToken(params: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ id: string }> {
    const created = await this.prisma.refreshToken.create({
      data: {
        user_id: params.userId,
        token_hash: params.tokenHash,
        expires_at: params.expiresAt,
      },
      select: { id: true },
    });
    return created;
  }

  async findRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: { token_hash: tokenHash },
      select: {
        id: true,
        user_id: true,
        token_hash: true,
        expires_at: true,
        revoked_at: true,
        replaced_by_token_id: true,
      },
    });
  }

  async revokeRefreshToken(params: {
    tokenId: string;
    reason?: string;
    replacedByTokenId?: string | null;
  }) {
    await this.prisma.refreshToken.update({
      where: { id: params.tokenId },
      data: {
        revoked_at: new Date(),
        revoked_reason: params.reason,
        replaced_by_token_id: params.replacedByTokenId,
      },
    });
  }
}
