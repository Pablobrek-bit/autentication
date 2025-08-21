import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/port/UserRepository';
import { PrismaService } from '../../application/service/PrismaService';
import type { UserRegisterSchema } from '../../application/dto/user/UserRegisterSchema';
import type { User } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async create(userRegisterSchema: UserRegisterSchema): Promise<void> {
    await this.prisma.user.create({
      data: {
        email: userRegisterSchema.email,
        password_hash: userRegisterSchema.password,
        full_name: userRegisterSchema.fullName,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

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
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
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
