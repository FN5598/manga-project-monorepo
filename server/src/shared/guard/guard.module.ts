import { Global, Module } from '@nestjs/common';
import { CookieModule } from '@shared/cookie/cookie.module';
import { JwtModule } from '@shared/jwt/jwt.module';

@Global()
@Module({
  imports: [CookieModule, JwtModule],
  exports: [CookieModule, JwtModule],
})
export class GuardModule {}
