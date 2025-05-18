import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Users.name, schema: UserSchema }],
      'users',
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
