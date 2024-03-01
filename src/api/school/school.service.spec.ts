import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

describe('SchoolService', () => {
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

  test('should create a new school', async () => {
    const testTime = new Date().toISOString();
    await mockDynamoDB.put({
      TableName: 'Schools',
      Item: {
        idx: 10000,
        schoolRegion: 'Seoul',
        schoolName: 'Test',
        createdAt: testTime,
      },
    });

    const { Item } = await mockDynamoDB.get({
      TableName: 'Schools',
      Key: { idx: 10000 },
    });

    expect(Item).toEqual({
      idx: 10000,
      schoolRegion: 'Seoul',
      schoolName: 'Test',
      createdAt: testTime,
    });
  });

  test('should CRUD a new news', async () => {
    const testTime = new Date().toISOString();
    await mockDynamoDB.put({
      TableName: 'News',
      Item: {
        idx: 10000,
        schoolId: 10001,
        newsId: 10002,
        content: 'HI',
        createdAt: testTime,
      },
    });
    await mockDynamoDB.update({
      TableName: 'News',
      Key: { idx: 10000 },
      UpdateExpression: 'SET #content = :content, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#content': 'content',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':content': 'Hello',
        ':updatedAt': testTime,
      },
    });

    const { Item } = await mockDynamoDB.get({
      TableName: 'News',
      Key: { idx: 10000 },
    });

    expect(Item).toEqual({
      idx: 10000,
      schoolId: 10001,
      newsId: 10002,
      content: 'Hello',
      createdAt: testTime,
      updatedAt: testTime,
    });

    await mockDynamoDB.update({
      TableName: 'News',
      Key: { idx: 10000 },
      UpdateExpression: 'SET #isDelete= :isDelete, #deletedAt = :deletedAt',
      ExpressionAttributeNames: {
        '#isDelete': 'isDelete',
        '#deletedAt': 'deletedAt',
      },
      ExpressionAttributeValues: {
        ':isDelete': 1,
        ':deletedAt': testTime,
      },
    });
    const { Item: deletedItem } = await mockDynamoDB.get({
      TableName: 'News',
      Key: { idx: 10000 },
    });

    expect(deletedItem).toEqual({
      idx: 10000,
      schoolId: 10001,
      newsId: 10002,
      content: 'Hello',
      isDelete: 1,
      createdAt: testTime,
      updatedAt: testTime,
      deletedAt: testTime,
    });
  });
});
