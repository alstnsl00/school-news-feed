import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@ApiTags('Schools')
@Controller('api/schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @ApiOperation({ summary: 'Create a school' })
  @ApiBody({ type: CreateSchoolDto })
  @UsePipes(new ValidationPipe())
  async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    if (!createSchoolDto.schoolRegion || !createSchoolDto.schoolName) {
      throw new BadRequestException();
    }

    const result = await this.schoolService.createSchool(createSchoolDto);

    if (result === 'FAIL') {
      throw new HttpException(
        'Requested school information is already registered.',
        400,
      );
    } else {
      return { statusCode: 200, message: 'OK' };
    }
  }

  @Post(':schoolId/news')
  @ApiOperation({ summary: 'Create news for a school' })
  @ApiParam({ name: 'schoolId', required: true })
  @ApiBody({ type: CreateNewsDto })
  @UsePipes(new ValidationPipe())
  async createNews(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Body() createNewsDto: CreateNewsDto,
  ) {
    if (!createNewsDto.content) {
      throw new BadRequestException();
    }

    const result = await this.schoolService.createNews(schoolId, createNewsDto);

    if (result === 'FAIL') {
      throw new HttpException(
        'Requested school information is not existed.',
        400,
      );
    } else {
      return { statusCode: 200, message: 'OK' };
    }
  }

  @Delete(':schoolId/news/:newsId')
  @ApiOperation({ summary: 'Delete news from a school' })
  @ApiParam({ name: 'schoolId', required: true })
  @ApiParam({ name: 'newsId', required: true })
  async deleteNews(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Param('newsId', ParseIntPipe) newsId: number,
  ) {
    const result = await this.schoolService.deleteNews(schoolId, newsId);

    if (result === 'FAIL') {
      throw new HttpException('Requested information is wronged.', 400);
    } else {
      return { statusCode: 200, message: 'OK' };
    }
  }

  @Put(':schoolId/news/:newsId')
  @ApiOperation({ summary: 'Update news from a school' })
  @ApiParam({ name: 'schoolId', required: true })
  @ApiParam({ name: 'newsId', required: true })
  @ApiBody({ type: UpdateNewsDto })
  @UsePipes(new ValidationPipe())
  async updateNews(
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Param('newsId', ParseIntPipe) newsId: number,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    if (!updateNewsDto.content) {
      throw new BadRequestException();
    }
    const result = await this.schoolService.updateNews(
      schoolId,
      newsId,
      updateNewsDto,
    );

    if (result === 'FAIL') {
      throw new HttpException('Requested information is not existed.', 400);
    } else {
      return { statusCode: 200, message: 'OK' };
    }
  }
}
