import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserPayload } from 'src/domain/interfaces/user-payload.interface'; // ton interface personnalisée

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction): Response | void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou mal formaté' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token) as UserPayload;
      req.user = decoded; // injecte l'utilisateur typé dans la requête
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  }
}
