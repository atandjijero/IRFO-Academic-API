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

      if (payload.status === 'blocked') {
        throw new ForbiddenException('Compte bloqué par l’administration');
      }

      if (payload.status === 'inactive') {
        throw new ForbiddenException('Compte inactif, veuillez contacter le support');
      }

      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        throw new ForbiddenException("Accès interdit : vous n'êtes autorisé à éffectuer cette actions");
      }

      return true;
    } catch {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
