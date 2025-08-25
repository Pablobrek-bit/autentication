export abstract class RefreshTokenRepository {
  abstract createRefreshToken(params: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<{ id: string }>;

  abstract findRefreshTokenByHash(tokenHash: string): Promise<{
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: Date;
    revoked_at: Date | null;
    replaced_by_token_id: string | null;
  } | null>;

  abstract revokeRefreshToken(params: {
    tokenId: string;
    reason?: string;
    replacedByTokenId?: string | null;
  }): Promise<void>;
}
