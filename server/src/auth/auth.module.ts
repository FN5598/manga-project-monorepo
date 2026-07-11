import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@shared/jwt/jwt.module';
import { CookieModule } from '@shared/cookie/cookie.module';

@Module({
  imports: [UsersModule, JwtModule, CookieModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
