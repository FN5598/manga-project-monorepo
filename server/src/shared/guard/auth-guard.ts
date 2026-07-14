import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  type Type,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CookieService } from '@shared/cookie/cookie.service';
import type {
  GraphQLContext,
  MinimalUser,
} from '@shared/graphql/graphql-context';
import { JwtService } from '@shared/jwt/jwt.service';
import { JWTTokenType } from '@shared/jwt/jwt.types';
import { UserRole } from '@users/entities/user-entity.types';
import type { Request } from 'express';

type RequestWithUser = Request & {
  user?: MinimalUser;
};

@Injectable()
export class BaseAuthGuard implements CanActivate {
  constructor(
    private readonly cookieService: CookieService,
    private readonly jwtService: JwtService,
    private readonly allowedRoles: UserRole[] = [],
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const user = await this.getUserFromRequest(request);

    if (!user) {
      throw new UnauthorizedException(
        'Must be authorized to access this route',
      );
    }

    if (this.allowedRoles.length && !this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }

    request.user = user;
    this.setGraphQLUser(context, user);

    return true;
  }

  private getRequest(context: ExecutionContext): RequestWithUser {
    if (context.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<GraphQLContext>()
        .req as RequestWithUser;
    }

    return context.switchToHttp().getRequest<RequestWithUser>();
  }

  private setGraphQLUser(context: ExecutionContext, user: MinimalUser) {
    if (context.getType<string>() !== 'graphql') {
      return;
    }

    GqlExecutionContext.create(context).getContext<GraphQLContext>().user =
      user;
  }

  private async getUserFromRequest(req: Request): Promise<MinimalUser | null> {
    const token = this.cookieService.getCookie(req, JWTTokenType.ACCESS_TOKEN);

    if (!token) return null;

    const result = await this.jwtService.verifyToken(
      token,
      JWTTokenType.ACCESS_TOKEN,
    );

    if (!result.ok) return null;

    return {
      userId: result.userId,
      role: result.role,
    };
  }
}

export function AuthGuard(...allowedRoles: UserRole[]): Type<CanActivate> {
  @Injectable()
  class RoleAuthGuard extends BaseAuthGuard {
    constructor(cookieService: CookieService, jwtService: JwtService) {
      super(cookieService, jwtService, allowedRoles);
    }
  }

  return mixin(RoleAuthGuard);
}

export const AuthenticatedGuard = AuthGuard();
export const AdminGuard = AuthGuard(UserRole.ADMIN);
