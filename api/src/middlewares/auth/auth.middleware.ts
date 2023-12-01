import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // La lógica de validación del token es que el token tenga pk_dev_L al inicio.
    if (!authHeader.startsWith('Bearer pk_dev_L')) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: 'Invalid Token',
        statusCode: '401',
      });
    }

    const token = authHeader.slice(7);
    req['user'] = { token };
    next();
  }
}
