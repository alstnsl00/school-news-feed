import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly testIdx: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly schoolRegion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly schoolName: string;
}
