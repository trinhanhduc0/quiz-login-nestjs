// src/auth/auth.service.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  private jwtSecret: string;

  constructor() {
    const serviceAccount = JSON.parse(
      readFileSync('firebase-config.json', 'utf-8'),
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    this.jwtSecret = process.env.JWT_SECRET || 'defaultSecret';
    Logger.log('AuthService initialized with secret');
  }

  /**
   * Create a JWT with same payload and exp as in Go code
   */
  async createJWT(claims: Auth): Promise<string> {
    const payload = {
      _id: claims.userId,
      email_id: claims.emailId,
      email: claims.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * claims.exp, // exp in UNIX seconds
    };

    return jwt.sign(payload, this.jwtSecret, { algorithm: 'HS256' });
  }

  /**
   * Validate and decode JWT
   */
  async validateJWT(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      Logger.error('JWT validation error 48', error);
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  /**
   * Verify Firebase ID token
   */
  async verifyIDToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (error) {
      Logger.error('Firebase token verification error 60', error);
      throw new UnauthorizedException(
        `Invalid Firebase token: ${error.message}`,
      );
    }
  }
}
