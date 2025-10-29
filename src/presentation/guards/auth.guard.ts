import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant ou invalide');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;

      // Vérification du statut de l'utilisateur
      if (payload.status === 'bloque') {
        throw new ForbiddenException('Compte bloqué par l’administration');
      }

      if (payload.status === 'inactif') {
        throw new ForbiddenException('Compte inactif, veuillez contacter le support');
      }

      // Vérification du rôle si nécessaire
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        throw new ForbiddenException('Accès interdit : Seul un admin est autorisé!');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Seul un admin est autorisé à faire cette action ou Token invalide ou expiré!');
    }
  }
}
