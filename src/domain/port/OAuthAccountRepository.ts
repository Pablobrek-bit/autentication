export abstract class OAuthAccountRepository {
  abstract linkOAuthAccount(
    userId: string,
    account: {
      provider: string;
      providerUserId: string;
      providerEmail?: string;
      accessToken?: string;
      refreshToken?: string;
    },
  ): Promise<void>;

  abstract findUserByOAuth(
    provider: string,
    providerUserId: string,
  ): Promise<{ id: string; email: string | null } | null>;
}
