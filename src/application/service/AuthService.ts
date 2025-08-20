import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/port/UserRepository';

@Injectable()
export class AuthService {
  constructor(private readonly repository: UserRepository) {}
}
