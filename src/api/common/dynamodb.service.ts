import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBClient,
  ExecuteStatementCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {
    this.client = new DynamoDBClient({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: this.configService.get('ACCESS_KEY'),
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
      },
    });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  async executeQuery(query: string) {
    const command = new ExecuteStatementCommand({
      Statement: query,
    });
    return this.docClient.send(command);
  }

  async getItem(tableName: string, key: any) {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });

    return this.docClient.send(command);
  }

  async putItem(tableName: string, item: any) {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });

    return this.docClient.send(command);
  }

  async deleteItem(tableName: string, key: any) {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });

    return this.docClient.send(command);
  }

  async updateItem(
    tableName: string,
    key: any,
    updateExpression: string,
    expressionAttributeNames: any,
    expressionAttributeValues: any,
  ) {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    return this.docClient.send(command);
  }

  async queryItems(params: any) {
    const command = new QueryCommand({
      TableName: params.tableName,
      KeyConditionExpression: params.keyConditionExpression,
      ExpressionAttributeValues: params.expressionAttributeValues,
    });

    return this.docClient.send(command);
  }
}
