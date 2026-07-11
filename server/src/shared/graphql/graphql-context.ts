import { UserRole } from '@users/entities/user-entity.types';
import type { Request } from 'express';

export interface MinimalUser {
  userId: string;
  role: UserRole;
}

export interface GraphQLContext {
  req: Request;
  user: MinimalUser | null;
}
