import type { User } from '@prisma/client';
import type { UserRegisterSchema } from '../../application/dto/user/UserRegisterSchema';

export abstract class UserRepository {
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract create(userRegisterSchema: UserRegisterSchema): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
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
