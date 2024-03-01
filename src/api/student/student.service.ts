import { Injectable } from '@nestjs/common';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBService } from '../common/dynamodb.service';
import { getIndex } from '../../util/auto-increment.util';

@Injectable()
export class StudentService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async subscribeSchool(studentId: number, schoolId: number) {
    const isExist = await this.dynamoDBService.executeQuery(
      `SELECT * FROM Subscriptions WHERE studentId = ${studentId} AND schoolId = ${schoolId} AND isCancel != 1`,
    );

    if (isExist?.Items.length > 0) return 'FAIL-0';

    const isInit = await this.dynamoDBService.executeQuery(
      `SELECT idx FROM Subscriptions`,
    );

    let currentIdx = await getIndex(isInit, 'idx');

    const school = await this.dynamoDBService.executeQuery(
      `SELECT idx FROM Schools WHERE idx=${schoolId}`,
    );

    let currentNewsId: number;
    if (school?.Items.length > 0) {
      const news = await this.dynamoDBService.executeQuery(
        `SELECT newsId FROM News WHERE schoolId = ${schoolId}`,
      );
      currentNewsId = await getIndex(news, 'newsId');
    } else {
      return 'FAIL-1';
    }

    const item = {
      idx: ++currentIdx,
      studentId,
      schoolId,
      createdAt: new Date().toISOString(),
      currentNewsId,
    };
    return this.dynamoDBService.putItem('Subscriptions', item);
  }

  async unsubscribeSchool(studentId: number, schoolId: number) {
    // 유효 데이터 확인
    const isExist = await this.dynamoDBService.executeQuery(
      `SELECT * FROM Subscriptions WHERE studentId = ${studentId} AND schoolId = ${schoolId} AND isCancel != 1`,
    );

    if (isExist?.Items.length === 0) return 'FAIL';

    const idx = Number(isExist.Items[0].idx.N);

    const news = await this.dynamoDBService.executeQuery(
      `SELECT newsId FROM News WHERE schoolId=${schoolId}`,
    );

    const lastNewsId = await getIndex(news, 'newsId');

    const key = {
      idx,
    };
    const updateExpression =
      'set #lastNewsId = :lastNewsId, #isCancel = :isCancel, #canceledAt = :canceledAt';
    const expressionAttributeNames = {
      '#lastNewsId': 'lastNewsId',
      '#isCancel': 'isCancel',
      '#canceledAt': 'canceledAt',
    };
    const expressionAttributeValues = {
      ':lastNewsId': lastNewsId,
      ':isCancel': 1,
      ':canceledAt': new Date().toISOString(),
    };
    return this.dynamoDBService.updateItem(
      'Subscriptions',
      key,
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    );
  }

  async getSubscriptions(studentId: number) {
    const subscription = await this.dynamoDBService.executeQuery(
      `SELECT * FROM Subscriptions WHERE studentId = ${studentId} AND isCancel != 1`,
    );

    if (subscription?.Items.length === 0)
      return { studentId, subscriptionList: [] };
    else {
      const subscriptionList = subscription.Items.flatMap((e) =>
        Number(e.schoolId.N),
      );
      return { studentId, subscriptionList };
    }
  }

  async getNewsfeed(studentId: number) {
    const subscriptionList = await this.dynamoDBService.executeQuery(
      `SELECT * FROM Subscriptions WHERE studentId = ${studentId}`,
    );
    const subscription = subscriptionList.Items.map((item) => unmarshall(item));

    const subscribedNewsfeed: any[] = [];

    for await (const e of subscription) {
      let newsfeedList: any;
      if (e.lastNewsId === undefined) {
        newsfeedList = await this.dynamoDBService.executeQuery(
          `SELECT * FROM News WHERE schoolId = ${e.schoolId} AND newsId > ${e.currentNewsId} AND isDelete != 1`,
        );
      } else {
        newsfeedList = await this.dynamoDBService.executeQuery(
          `SELECT * FROM News WHERE schoolId = ${e.schoolId} AND newsId BETWEEN ${e.currentNewsId} AND ${e.lastNewsId} AND isDelete != 1`,
        );
      }
      if (newsfeedList.Items.length > 0) {
        const newsfeed = newsfeedList.Items.map((item) => unmarshall(item));
        subscribedNewsfeed.push(...newsfeed);
      }
    }

    subscribedNewsfeed.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return subscribedNewsfeed;
  }
}
