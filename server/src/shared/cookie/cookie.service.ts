import { Injectable } from '@nestjs/common';
import type { Response, Request } from 'express';
import { JWTTokenType } from '@shared/jwt/jwt.types';

const isProd = (process.env.NODE_ENV ?? 'development') === 'production';
export const accessCookieName = isProd ? '__Host-access_token' : 'access_token';
export const refreshCookieName = isProd
  ? '__Host-refresh_token'
  : 'refresh_token';

@Injectable()
export class CookieService {
  setJWTCookie(res: Response, token: string, kind: JWTTokenType): void {
    const isAccessCookie = kind === JWTTokenType.ACCESS_TOKEN;
    const name = isAccessCookie ? accessCookieName : refreshCookieName;
    const maxAge = isAccessCookie ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    res.cookie(name, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
  }

  clearJWTCookie(res: Response, kind: JWTTokenType): void {
    const isAccessCookie = kind === JWTTokenType.ACCESS_TOKEN;
    const name = isAccessCookie ? accessCookieName : refreshCookieName;

    res.clearCookie(name, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
  }

  getCookie(req: Request, kind: JWTTokenType): string | undefined {
    const isAccessCookie = kind === JWTTokenType.ACCESS_TOKEN;
    const name = isAccessCookie ? accessCookieName : refreshCookieName;

    return req.cookies[name] as string | undefined;
  }

  clearAllAuthCookies(res: Response): void {
    this.clearJWTCookie(res, JWTTokenType.ACCESS_TOKEN);
    this.clearJWTCookie(res, JWTTokenType.REFRESH_TOKEN);
  }
}
