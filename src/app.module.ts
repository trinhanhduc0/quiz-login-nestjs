import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './service/auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Kết nối đến DB 'users'
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_USERDB_URI');
        console.log('MONGODB_USERDB_URI:', uri); // 👈 kiểm tra
        if (!uri) {
          throw new Error('MONGODB_USERDB_URI is not defined in .env');
        }
        return { uri };
      },
      connectionName: 'users',
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
