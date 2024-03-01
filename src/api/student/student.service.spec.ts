import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

describe('StudentService', () => {
  const isTest = process.env.JEST_WORKER_ID;

  const mockDynamoDB = DynamoDBDocument.from(
    new DynamoDB({
      ...(isTest && {
        endpoint: 'http://localhost:8000',
        region: 'local',
        credentials: {
          accessKeyId: 'fakeAccessKeyId',
          secretAccessKey: 'fakeSecretAccessKey',
        },
      }),
    }),
    {
      marshallOptions: {
        convertEmptyValues: true,
      },
    },
  );
  test('should subscribe/unsubscribe a school', async () => {
    const testTime = new Date().toISOString();
    await mockDynamoDB.put({
      TableName: 'Subscriptions',
      Item: {
        idx: 10000,
        schoolId: 10001,
        studentId: 10002,
        currentNewsId: 10003,
        createdAt: testTime,
      },
    });

    const { Item } = await mockDynamoDB.get({
      TableName: 'Subscriptions',
      Key: { idx: 10000 },
    });

    expect(Item).toEqual({
      idx: 10000,
      schoolId: 10001,
      studentId: 10002,
      currentNewsId: 10003,
      createdAt: testTime,
    });

    await mockDynamoDB.update({
      TableName: 'Subscriptions',
      Key: { idx: 10000 },
      UpdateExpression:
        'SET #isCancel = :isCancel, #lastNewsId = :lastNewsId, #canceledAt = :canceledAt',
      ExpressionAttributeNames: {
        '#isCancel': 'isCancel',
        '#lastNewsId': 'lastNewsId',
        '#canceledAt': 'canceledAt',
      },
      ExpressionAttributeValues: {
        ':isCancel': 1,
        ':lastNewsId': 10003,
        ':canceledAt': testTime,
      },
    });

    const { Item: canceledItem } = await mockDynamoDB.get({
      TableName: 'Subscriptions',
      Key: { idx: 10000 },
    });

    expect(canceledItem).toEqual({
      idx: 10000,
      schoolId: 10001,
      studentId: 10002,
      currentNewsId: 10003,
      lastNewsId: 10003,
      isCancel: 1,
      createdAt: testTime,
      canceledAt: testTime,
    });
  });
});
