import { ObjectId } from 'mongoose';

// src/auth/entities/auth.entity.ts
export interface Auth {
  userId: string;
  emailId: string;
  email: string;
  exp: number; // in hours
}
