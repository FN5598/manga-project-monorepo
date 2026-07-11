import { Injectable } from '@nestjs/common';
import { SignJWT, errors, jwtVerify } from 'jose';
import type { UserRole } from '@users/entities/user-entity.types';
import {
  JWTTokenType,
  TokenFailType,
  type SignJWTPayload,
  type VerifyTokenResponse,
} from './jwt.types';

type JWTOptions = {
  expiresIn: string;
  tokenType: JWTTokenType;
};

const ISSUER = 'manga-auth';
const ACCESS_AUDIENCE = 'manga-access';
const REFRESH_AUDIENCE = 'manga-refresh';
const accessSecret = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
);
const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_TOKEN ?? 'dev-refresh-secret',
);

@Injectable()
export class JwtService {
  private async signJWT(payload: SignJWTPayload, options: JWTOptions) {
    const isAccessToken = options.tokenType === JWTTokenType.ACCESS_TOKEN;
    const secret = isAccessToken ? accessSecret : refreshSecret;
    const audience = isAccessToken ? ACCESS_AUDIENCE : REFRESH_AUDIENCE;

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject(payload.userId)
      .setIssuer(ISSUER)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(secret);

    return token;
  }

  async signJWTToken(kind: JWTTokenType, payload: SignJWTPayload) {
    const isAccessToken = kind === JWTTokenType.ACCESS_TOKEN;
    const expiresIn = isAccessToken ? '15m' : '7d';
    return this.signJWT(payload, { expiresIn, tokenType: kind });
  }

  async verifyToken(
    token: string,
    kind: JWTTokenType,
  ): Promise<VerifyTokenResponse> {
    const isAccessToken = kind === JWTTokenType.ACCESS_TOKEN;
    const tokenMaxAge = isAccessToken ? '15m' : '7m';
    const audience = isAccessToken ? ACCESS_AUDIENCE : REFRESH_AUDIENCE;

    try {
      const secret = isAccessToken ? accessSecret : refreshSecret;
      const { payload } = await jwtVerify(token, secret, {
        issuer: ISSUER,
        audience,
        algorithms: ['HS256'],
        typ: 'JWT',
        maxTokenAge: tokenMaxAge,
      });

      return {
        ok: true,
        userId: payload.sub as string,
        role: payload.role as UserRole,
      };
    } catch (error) {
      return this.handleJWTErrors(error);
    }
  }

  private handleJWTErrors(error: unknown): VerifyTokenResponse {
    if (error instanceof errors.JWTExpired) {
      return {
        ok: false,
        type: TokenFailType.EXPIRED,
      };
    }

    if (error instanceof errors.JWTInvalid) {
      return {
        ok: false,
        type: TokenFailType.INVALID,
      };
    }

    return {
      ok: false,
      type: TokenFailType.UNKNOWN,
    };
  }
}
