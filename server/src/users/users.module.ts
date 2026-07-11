import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from '@users/repository/users.repository';
import { User, UserSchema } from './entities/user.entity';
import { UserResolver } from './users.resolver';
import { CookieModule } from '@shared/cookie/cookie.module';
import { JwtModule } from '@shared/jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    CookieModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserResolver],
  exports: [UserRepository],
})
export class UsersModule {}
