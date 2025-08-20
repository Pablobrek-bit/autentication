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
    isAddress?: string;
    userAgent?: string;
  }): Promise<{ id: string }>;
}
