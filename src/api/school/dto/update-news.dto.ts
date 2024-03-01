import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNewsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
