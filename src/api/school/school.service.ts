import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { DynamoDBService } from '../common/dynamodb.service';
import { getIndex } from '../../util/auto-increment.util';

@Injectable()
export class SchoolService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async createSchool(createSchoolDto: CreateSchoolDto) {
    const isExist = await this.dynamoDBService.executeQuery(
      `SELECT * FROM Schools WHERE schoolRegion = '${createSchoolDto.schoolRegion}' AND schoolName = '${createSchoolDto.schoolName}'`,
    );

    if (isExist?.Items.length > 0) return 'FAIL';

    const isInit = await this.dynamoDBService.executeQuery(
      `SELECT idx FROM Schools`,
    );

    let currentIdx = await getIndex(isInit, 'idx');

    return this.dynamoDBService.putItem('Schools', {
      idx: createSchoolDto.testIdx ? createSchoolDto.testIdx : ++currentIdx,
      ...createSchoolDto,
      createdAt: new Date().toISOString(),
    });
  }

  async createNews(schoolId: number, createNewsDto: CreateNewsDto) {
    const isExist = await this.dynamoDBService.executeQuery(
      `SELECT * FROM Schools WHERE idx = ${schoolId}`,
    );

    if (isExist?.Items.length === 0) return 'FAIL';

    const isInit = await this.dynamoDBService.executeQuery(
      `SELECT idx FROM News`,
    );

    let currentIdx = await getIndex(isInit, 'idx');

    const isChildInit = await this.dynamoDBService.executeQuery(
      `SELECT newsId FROM News WHERE schoolId = ${schoolId}`,
    );

    let currentNewsId = await getIndex(isChildInit, 'newsId');

    const item = {
      idx: createNewsDto.testIdx ? createNewsDto.testIdx : ++currentIdx,
      schoolId,
      newsId: ++currentNewsId,
      ...createNewsDto,
      createdAt: new Date().toISOString(),
    };

    return this.dynamoDBService.putItem('News', item);
  }

  async deleteNews(schoolId: number, newsId: number) {
    const isExist = await this.dynamoDBService.executeQuery(
      `SELECT idx FROM News WHERE schoolId = ${schoolId} AND newsId = ${newsId}`,
    );

    if (isExist.Items.length == 0) return 'FAIL';

    const idx = Number(isExist.Items[0].idx.N);

    const key = {
      idx: idx,
    };
    const updateExpression =
      'set #isDelete = :isDelete, #deletedAt = :deletedAt';
    const expressionAttributeNames = {
      '#isDelete': 'isDelete',
      '#deletedAt': 'deletedAt',
    };
    const expressionAttributeValues = {
      ':isDelete': 1,
      ':deletedAt': new Date().toISOString(),
    };
    return this.dynamoDBService.updateItem(
      'News',
      key,
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    );
  }

  async updateNews(
    schoolId: number,
    newsId: number,
    updateNewsDto: UpdateNewsDto,
  ) {
    const isExist = await this.dynamoDBService.executeQuery(
      `SELECT idx FROM News WHERE schoolId = ${schoolId} AND newsId = ${newsId} AND isDelete != 1`,
    );

    if (isExist.Items.length == 0) return 'FAIL';

    const idx = Number(isExist.Items[0].idx.N);

    const key = {
      idx,
    };
    const updateExpression = 'set #content = :content, #updatedAt = :updatedAt';
    const expressionAttributeNames = {
      '#content': 'content',
      '#updatedAt': 'updatedAt',
    };
    const expressionAttributeValues = {
      ':content': updateNewsDto.content,
      ':updatedAt': new Date().toISOString(),
    };
    return this.dynamoDBService.updateItem(
      'News',
      key,
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    );
  }
}
