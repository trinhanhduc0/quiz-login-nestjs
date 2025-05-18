// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../../user/user.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { RedisService } from 'src/service/redis/redis.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @Post('google/login')
  async loginWithGoogle(@Body() body: AuthLoginDto) {
    const { token } = body;
    Logger.log(token);
    if (!token) {
      throw new HttpException('Missing token', HttpStatus.BAD_REQUEST);
    }

    // 1. Verify Firebase ID Token
    const decoded = await this.authService.verifyIDToken(token);

    const emailId = decoded.uid;
    const email = decoded.email;
    const name = decoded.name;
    if (!email || !name) {
      throw new HttpException('Invalid token claims', HttpStatus.BAD_REQUEST);
    }
    Logger.log(decoded);

    // 2. Check user in DB
    let user = await this.userService.findByEmailId(email);
    Logger.log('User found:', user);
    //******************************** */

    if (!user) {
      const [firstName, ...rest] = name.split(' ');
      const lastName = rest.join(' ') || '';
      user = await this.userService.create({
        email_id: emailId,
        email,
        first_name: name,
        last_name: name,
        password: 'default_password',
      });
    }

    // 3. Generate JWT
    const jwtToken = await this.authService.createJWT({
      userId: emailId,
      emailId,
      email,
      exp: 24, // 24 giờ
    });

    // 4. Lưu vào Redis
    await this.redisService.set(`user_token:${emailId}`, jwtToken, 86400); // TTL: 24h

    // 5. Trả về client
    return { token: jwtToken };
  }
}
