import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@users/repository/users.repository';
import { Request } from 'express';
import { CookieService } from '@shared/cookie/cookie.service';
import { JwtService } from '@shared/jwt/jwt.service';
import { JWTTokenType } from '@shared/jwt/jwt.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cookieService: CookieService,
    private readonly jwtService: JwtService,
  ) {}

  async getCurrentUser(req: Request) {
    const refreshToken = this.cookieService.getCookie(
      req,
      JWTTokenType.REFRESH_TOKEN,
    );
    const accessToken = this.cookieService.getCookie(
      req,
      JWTTokenType.ACCESS_TOKEN,
    );

    if (!accessToken && !refreshToken)
      throw new UnauthorizedException(
        'No way to identificate user. Please log in',
      );

    const userId =
      (await this.getUserIdFromToken(accessToken, JWTTokenType.ACCESS_TOKEN)) ??
      (await this.getUserIdFromToken(refreshToken, JWTTokenType.REFRESH_TOKEN));

    if (!userId) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    return await this.userRepository.findUserById(userId);
  }

  private async getUserIdFromToken(
    token: string | undefined,
    type: JWTTokenType,
  ): Promise<string | null> {
    if (!token) {
      return null;
    }

    const payload = await this.jwtService.verifyToken(token, type);

    if (payload.ok !== true) {
      return null;
    }

    return payload.userId;
  }
}
