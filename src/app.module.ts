import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SchoolModule } from './api/school/school.module';
import { StudentModule } from './api/student/student.module';
import { CommonModule } from './api/common/common.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [SchoolModule, StudentModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
