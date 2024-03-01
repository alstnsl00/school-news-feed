import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DynamoDBService } from './dynamodb.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
    }),
  ],
  providers: [DynamoDBService],
  exports: [DynamoDBService],
})
export class CommonModule {}
