import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { StudentService } from './student.service';

@ApiTags('Students')
@Controller('api/students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post(':studentId/subscriptions/:schoolId')
  @ApiOperation({ summary: 'Subscribe to a school' })
  @ApiParam({ name: 'studentId', required: true })
  @ApiParam({ name: 'schoolId', required: true })
  async subscribeSchool(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ) {
    const result = await this.studentService.subscribeSchool(
      studentId,
      schoolId,
    );

    if (result === 'FAIL-0') {
      throw new HttpException('You are already subscribed.', 400);
    } else if (result === 'FAIL-1') {
      throw new HttpException('Requested schoolId is not existed.', 400);
    } else {
      return { statusCode: 200, message: 'OK' };
    }
  }

  @Delete(':studentId/subscriptions/:schoolId')
  @ApiOperation({ summary: 'Unsubscribe from a school' })
  @ApiParam({ name: 'studentId', required: true })
  @ApiParam({ name: 'schoolId', required: true })
  async unsubscribeSchool(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ) {
    const result = await this.studentService.unsubscribeSchool(
      studentId,
      schoolId,
    );

    if (result === 'FAIL') {
      throw new HttpException('You are already unsubscribed.', 400);
    } else {
      return { statusCode: 200, message: 'OK' };
    }
  }

  @Get(':studentId/subscriptions')
  @ApiOperation({ summary: 'Get subscriptions of a student' })
  @ApiParam({ name: 'studentId', required: true })
  async getSubscriptions(@Param('studentId', ParseIntPipe) studentId: number) {
    const result = await this.studentService.getSubscriptions(studentId);

    return { statusCode: 200, message: 'OK', data: result };
  }

  @Get(':studentId/newsfeed')
  @ApiOperation({ summary: 'Get newsfeed of a student' })
  @ApiParam({ name: 'studentId', required: true })
  async getNewsfeed(@Param('studentId', ParseIntPipe) studentId: number) {
    const result = await this.studentService.getNewsfeed(studentId);

    return { statusCode: 200, message: 'OK', data: result };
  }
}
