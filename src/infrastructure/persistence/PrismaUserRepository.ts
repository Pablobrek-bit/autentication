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

  async findUserByOAuth(provider: string, providerUserId: string) {
    const account = await this.prisma.oAuthAccount.findFirst({
      where: {
        provider,
        provider_user_id: providerUserId,
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    if (!account) return null;
    return { id: account.user.id, email: account.user.email };
  }

  async createUserFromOAuth(params: {
    email: string | null;
    fullName: string | null;
    emailVerified?: boolean;
  }) {
    const created = await this.prisma.user.create({
      data: {
        email: params.email,
        full_name: params.fullName ?? undefined,
        email_verified: params.emailVerified ?? true,
      },
      select: {
        id: true,
        email: true,
      },
    });
    return created;
  }

  async linkOAuthAccount(
    userId: string,
    account: {
      provider: string;
      providerUserId: string;
      providerEmail?: string;
      accessToken?: string;
      refreshToken?: string;
    },
  ) {
    await this.prisma.oAuthAccount.create({
      data: {
        user_id: userId,
        provider: account.provider,
        provider_user_id: account.providerUserId,
        provider_email: account.providerEmail,
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      },
    });
  }
}
