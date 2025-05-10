// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { Auth } from './entities/auth.entity';
// import { AuthClaims } from './interfaces/auth-claims.interface';

@Injectable()
export class AuthService {
  private jwtSecret: string;

  constructor() {
    const serviceAccount = JSON.parse(
      readFileSync('firebase-config.json', 'utf-8'), // đường dẫn đến file config Firebase
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.jwtSecret = process.env.JWT_SECRET || 'defaultSecret'; // nên đặt biến môi trường
  }

  async createJWT(claims: Auth): Promise<string> {
    const payload = {
      _id: claims.userId,
      email_id: claims.emailId,
      email: claims.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * claims.exp, // exp là số giờ
    };
    return jwt.sign(payload, this.jwtSecret, { algorithm: 'HS256' });
  }

  async validateJWT(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(token);
  }
}
