import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwt: JwtService) {}

  // ✅ Génère un token avec email, id et rôle
  generateToken(payload: UserPayload): string {
    return this.jwt.sign({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
  }

  // ✅ Génère un token pour vérification d'email
  generateEmailVerificationToken(userId: string, email: string): string {
    return this.jwt.sign({ sub: userId, email });
  }

  // ✅ Vérifie un token d'authentification
  verifyAuthToken(token: string): UserPayload {
    return this.jwt.verify(token) as UserPayload;
  }

  // ✅ Vérifie un token de vérification d'email
  verifyEmailToken(token: string): { sub: string; email: string } {
    return this.jwt.verify(token) as { sub: string; email: string };
  }
}
