import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../application/service/PrismaService';
import type { OAuthAccountRepository } from '../../domain/port/OAuthAccountRepository';

@Injectable()
export class PrismaOAuthAccountRepository implements OAuthAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}
