import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.log(
        `[${req.ip}] ${req.method} ${req.url} ${JSON.stringify(
          req.params,
        )} ${JSON.stringify(req.body)} ${JSON.stringify(req.query)} - ${
          res.statusCode
        }`,
      );
    });

    next();
  }
}
