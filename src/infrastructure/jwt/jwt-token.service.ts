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

  
  generateToken(payload: UserPayload): string {
    return this.jwt.sign({
      id: payload.id,
      email: payload.email,
      role: payload.role,
      status: payload.status,
    });
  }

  
  generateEmailVerificationToken(userId: string, email: string): string {
    return this.jwt.sign({ sub: userId, email });
  }

  verifyAuthToken(token: string): UserPayload {
    try {
      return this.jwt.verify<UserPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Token d’authentification invalide ou expiré');
    }
  }

  verifyEmailToken(token: string): { sub: string; email: string } {
    try {
      return this.jwt.verify<{ sub: string; email: string }>(token);
    } catch (error) {
      throw new UnauthorizedException('Token de vérification invalide ou expiré');
    }
  }
}
