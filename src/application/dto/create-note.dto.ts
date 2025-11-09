import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: '653a1f2b8c9d3e0012a4b1c9' })
  @IsMongoId()
  @IsNotEmpty()
  school: string;

  @ApiProperty({ example: '653a1f2b8c9d3e0012a4b1d2' })
  @IsMongoId()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: '653a1f2b8c9d3e0012a4b1e7' })
  @IsMongoId()
  @IsNotEmpty()
  academicYear: string;

  @ApiProperty({ example: '653a1f2b8c9d3e0012a4b1f4' })
  @IsMongoId()
  @IsNotEmpty()
  student: string;

  @ApiProperty({ example: 17.5 })
  @IsNumber()
  @IsNotEmpty()
  score: number;
}
