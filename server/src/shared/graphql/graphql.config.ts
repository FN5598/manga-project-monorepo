import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import type { DynamicModule } from '@nestjs/common';
import type { Request } from 'express';
import { CookieModule } from '@shared/cookie/cookie.module';
import { CookieService } from '@shared/cookie/cookie.service';
import { JwtModule } from '@shared/jwt/jwt.module';
import { JwtService } from '@shared/jwt/jwt.service';
import { JWTTokenType } from '@shared/jwt/jwt.types';
import type { GraphQLContext } from './graphql-context';
import { join } from 'node:path';

export const GRAPHQL_SCHEMA_PATH = join(__dirname, 'schema.gql');

export async function createGraphQLContext(
  req: Request,
  jwtService: JwtService,
  cookieService: CookieService,
): Promise<GraphQLContext> {
  const token = cookieService.getCookie(req, JWTTokenType.ACCESS_TOKEN);

  if (!token) {
    return { req, user: null };
  }

  const result = await jwtService.verifyToken(token, JWTTokenType.ACCESS_TOKEN);

  if (!result.ok) {
    return { req, user: null };
  }

  return {
    req,
    user: {
      userId: result.userId,
      role: result.role,
    },
  };
}

export function connectToGraphQL(): DynamicModule {
  return GraphQLModule.forRootAsync<ApolloDriverConfig>({
    driver: ApolloDriver,
    imports: [JwtModule, CookieModule],
    inject: [JwtService, CookieService],
    useFactory: (jwtService: JwtService, cookieService: CookieService) => ({
      autoSchemaFile: true,
      path: 'api/graphql',
      context: ({ req }: { req: Request }) =>
        createGraphQLContext(req, jwtService, cookieService),
    }),
  });
}
