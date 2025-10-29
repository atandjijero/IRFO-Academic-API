import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  status?: string;
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  // Génère un token JWT à partir d’un payload typé
  generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  // Vérifie et décode un token JWT
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
