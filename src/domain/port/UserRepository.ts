import type { User } from '@prisma/client';
import type { UserRegisterSchema } from '../../application/dto/user/UserRegisterSchema';

export abstract class UserRepository {
  abstract existsByEmail(email: string): Promise<boolean>;

  abstract create(userRegisterSchema: UserRegisterSchema): Promise<void>;

  abstract findByEmail(email: string): Promise<User | null>;

  abstract createUserFromOAuth(params: {
    email: string | null;
    fullName: string | null;
    emailVerified?: boolean;
  }): Promise<{ id: string; email: string | null }>;
}
