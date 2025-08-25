import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../../domain/port/RefreshTokenRepository';
import { createHash, randomBytes } from 'crypto';
import { env } from '../../shared/env';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly repository: RefreshTokenRepository) {}

  // implement create method
  async issueRefreshToken(
    userId: string,
  ): Promise<{ id: string; token: string }> {
    const token = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + env.JWT_REFRESH_TTL * 1000);
    const created = await this.repository.createRefreshToken({
      userId,
      tokenHash,
      expiresAt,
    });

    return { id: created.id, token };
  }

  // implement find by hash method
  async findRefreshTokenByHash(hash: string): Promise<{
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: Date;
    revoked_at: Date | null;
    replaced_by_token_id: string | null;
  } | null> {
    return this.repository.findRefreshTokenByHash(hash);
  }

  // implement revoke method
  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.repository.revokeRefreshToken({ tokenId, reason: 'logout' });
  }

  public hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
