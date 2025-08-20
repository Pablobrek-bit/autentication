import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/port/UserRepository';

@Injectable()
export class PrismaUserRepository implements UserRepository {}
