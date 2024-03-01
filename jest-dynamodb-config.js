const config = {
  tables: [
    {
      TableName: `Schools`,
      KeySchema: [{ AttributeName: 'idx', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'idx', AttributeType: 'N' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    {
      TableName: `News`,
      KeySchema: [{ AttributeName: 'idx', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'idx', AttributeType: 'N' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    {
      TableName: `Subscriptions`,
      KeySchema: [{ AttributeName: 'idx', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'idx', AttributeType: 'N' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
  port: 8000,
};
module.exports = config;
