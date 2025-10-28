import { UserPayload } from 'src/domain/interfaces/user-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
