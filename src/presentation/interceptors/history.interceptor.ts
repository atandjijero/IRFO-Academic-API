
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { HistoryService } from 'src/application/services/history.service';

@Injectable()
export class HistoryInterceptor implements NestInterceptor {
  constructor(private readonly historyService: HistoryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    return next.handle().pipe(
      tap(() => {
        if (user) {
          const method = req.method.toLowerCase();
          const path = req.route?.path || req.originalUrl;
          const description = `${method.toUpperCase()} ${path}`;
          this.historyService.logAction(user.id, method, description);
        }
      }),
    );
  }
}
