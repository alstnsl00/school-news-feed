import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly testIdx: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
