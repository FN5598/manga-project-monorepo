import type { UserRole } from '@users/entities/user-entity.types';

export enum JWTTokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum TokenFailType {
  EXPIRED = 'expired',
  INVALID = 'invalid',
  UNKNOWN = 'unknown',
}

export type SignJWTPayload = {
  userId: string;
  role: UserRole;
  data?: Record<string, unknown>;
};

export type VerifyTokenResponse =
  | {
      ok: true;
      userId: string;
      role: UserRole;
    }
  | {
      ok: false;
      type: TokenFailType;
    };
