import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HistoryService } from 'src/application/services/history.service';

@Injectable()
export class ActionLoggerMiddleware implements NestMiddleware {
  constructor(private readonly historyService: HistoryService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    // Routes à ignorer (optionnel)
    const ignoredRoutes = ['/auth/login', '/auth/verify-login-otp'];

    // Enregistrer l'action après la réponse
    res.on('finish', async () => {
      if (user?.id && !ignoredRoutes.includes(req.path)) {
        const actionType = req.method.toLowerCase(); // get, post, put, delete
        const description = `${req.method} ${req.originalUrl}`;
        await this.historyService.logAction(user.id, actionType, description);
      }
    });

    next();
  }
}
