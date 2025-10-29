import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  status?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwt: JwtService) {}

  // ✅ Génère un token JWT pour l'authentification
  generateToken(payload: UserPayload): string {
    return this.jwt.sign({
      id: payload.id,
      email: payload.email,
      role: payload.role,
      status: payload.status,
    });
  }

  // ✅ Génère un token dédié à la vérification d'email
  generateEmailVerificationToken(userId: string, email: string): string {
    return this.jwt.sign({ sub: userId, email });
  }

  // ✅ Vérifie et décode un token d'authentification
  verifyAuthToken(token: string): UserPayload {
    try {
      return this.jwt.verify<UserPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Token d’authentification invalide ou expiré');
    }
  }

  // ✅ Vérifie et décode un token de vérification d’email
  verifyEmailToken(token: string): { sub: string; email: string } {
    try {
      return this.jwt.verify<{ sub: string; email: string }>(token);
    } catch (error) {
      throw new UnauthorizedException('Token de vérification invalide ou expiré');
    }
  }
}
