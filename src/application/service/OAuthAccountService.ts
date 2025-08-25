import { Injectable } from '@nestjs/common';
import type { OAuthAccountRepository } from '../../domain/port/OAuthAccountRepository';

@Injectable()
export class OAuthAccountService {
  constructor(private readonly repository: OAuthAccountRepository) {}

  // implement findUserByOAuth
  async findUserByOAuth(
    provider: string,
    providerUserId: string,
  ): Promise<{
    id: string;
    email: string | null;
  } | null> {
    return await this.repository.findUserByOAuth(provider, providerUserId);
  }

  // implement linkWithOAuth
  async linkWithOAuth(
    userId: string,
    provider: string,
    providerUserId: string,
    providerEmail?: string,
    accessToken?: string,
    refreshToken?: string,
  ): Promise<void> {
    await this.repository.linkOAuthAccount(userId, {
      provider,
      providerUserId,
      providerEmail,
      accessToken,
      refreshToken,
    });
  }
}
