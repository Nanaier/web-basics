// types/express.d.ts

import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Додаємо властивість user до інтерфейсу Request
    }
  }
}
