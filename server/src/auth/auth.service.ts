import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-uo.dto';
import argon2 from 'argon2';
import { UserRepository } from '@users/repository/users.repository';
import { JwtService } from '@shared/jwt/jwt.service';
import { JWTTokenType, TokenFailType } from '@shared/jwt/jwt.types';
import type { Request, Response } from 'express';
import { CookieService } from '@shared/cookie/cookie.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  async signUp(body: SignUpDto, res: Response) {
    const { password, email, username } = body;
    const hashedPassword = await argon2.hash(password);

    const createdUser = await this.userRepository.createUser({
      email,
      username,
      hashedPassword,
    });

    const accessToken = await this.jwtService.signJWTToken(
      JWTTokenType.ACCESS_TOKEN,
      {
        userId: createdUser._id.toString(),
        role: createdUser.role,
      },
    );
    const refreshToken = await this.jwtService.signJWTToken(
      JWTTokenType.REFRESH_TOKEN,
      {
        userId: createdUser._id.toString(),
        role: createdUser.role,
      },
    );

    this.cookieService.setJWTCookie(
      res,
      accessToken,
      JWTTokenType.ACCESS_TOKEN,
    );
    this.cookieService.setJWTCookie(
      res,
      refreshToken,
      JWTTokenType.REFRESH_TOKEN,
    );
    const hashedToken = await argon2.hash(refreshToken);
    await this.userRepository.updateRefreshToken(
      hashedToken,
      createdUser._id.toString(),
    );

    return createdUser;
  }

  async login(body: LoginDto, res: Response) {
    const { email, password } = body;
    const user = await this.userRepository.findUserByEmail(email, true);
    const isPasswordMatch = await argon2.verify(user.hashedPassword, password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    const accessToken = await this.jwtService.signJWTToken(
      JWTTokenType.ACCESS_TOKEN,
      {
        userId: user._id.toString(),
        role: user.role,
      },
    );
    const refreshToken = await this.jwtService.signJWTToken(
      JWTTokenType.REFRESH_TOKEN,
      {
        userId: user._id.toString(),
        role: user.role,
      },
    );

    this.cookieService.setJWTCookie(
      res,
      accessToken,
      JWTTokenType.ACCESS_TOKEN,
    );
    this.cookieService.setJWTCookie(
      res,
      refreshToken,
      JWTTokenType.REFRESH_TOKEN,
    );

    await this.userRepository.updateRefreshToken(
      refreshToken,
      user._id.toString(),
    );

    return user;
  }

  async refreshAccessToken(req: Request, res: Response) {
    const accessToken = this.cookieService.getCookie(
      req,
      JWTTokenType.ACCESS_TOKEN,
    );
    const refreshToken = this.cookieService.getCookie(
      req,
      JWTTokenType.REFRESH_TOKEN,
    );

    if (accessToken) {
      const accessTokenPayload = await this.jwtService.verifyToken(
        accessToken,
        JWTTokenType.ACCESS_TOKEN,
      );
      if (accessTokenPayload.ok !== true) {
        this.cookieService.clearJWTCookie(res, JWTTokenType.ACCESS_TOKEN);
        throw new UnauthorizedException('Invalid access token');
      }

      return {
        message: 'Access cookie still exists',
        isLoggedIn: true,
      };
    }

    if (!refreshToken) {
      return {
        message: 'User is not logged in',
        isLoggedIn: false,
      };
    }

    const refreshTokenPayload = await this.jwtService.verifyToken(
      refreshToken,
      JWTTokenType.REFRESH_TOKEN,
    );

    if (refreshTokenPayload?.ok !== true) {
      switch (refreshTokenPayload.type) {
        case TokenFailType.EXPIRED:
          throw new UnauthorizedException('Refresh token expired.');
        case TokenFailType.INVALID:
          throw new UnauthorizedException('Invalid refresh token');
        default:
          throw new UnauthorizedException('Failed to verify refresh token');
      }
    }

    const newAccessToken = await this.jwtService.signJWTToken(
      JWTTokenType.ACCESS_TOKEN,
      {
        userId: refreshTokenPayload.userId,
        role: refreshTokenPayload.role,
      },
    );
    this.cookieService.setJWTCookie(
      res,
      newAccessToken,
      JWTTokenType.ACCESS_TOKEN,
    );

    this.logger.log('refresh access token controller called', {
      userId: refreshTokenPayload.userId,
    });

    return {
      message: 'Successfully refreshed access token',
      isLoggedIn: true,
    };
  }

  logout(req: Request, res: Response) {
    try {
      const accessToken = this.cookieService.getCookie(
        req,
        JWTTokenType.ACCESS_TOKEN,
      );
      const refreshToken = this.cookieService.getCookie(
        req,
        JWTTokenType.REFRESH_TOKEN,
      );

      if (!accessToken && !refreshToken)
        throw new UnauthorizedException('No credentials');

      this.logger.log('Logout controller called');

      return { message: 'Successfully logged out' };
    } finally {
      this.cookieService.clearAllAuthCookies(res);
    }
  }
}
