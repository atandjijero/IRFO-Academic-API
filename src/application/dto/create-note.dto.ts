import { IsNotEmpty, IsNumber, IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({
    example: 'ID of the school,example:653a1f2b8c9d3e0012a4b1c9',
    description: 'MongoDB ID of the school',
  })
  @IsMongoId()
  school: string;

  @ApiProperty({
    example: 'ID of the subject,example:653a1f2b8c9d3e0012a4b1d2',
    description: 'MongoDB ID of the subject',
  })
  @IsMongoId()
  subject: string;

  @ApiProperty({
    example: 'ID of the academic year, example:653a1f2b8c9d3e0012a4b1e7',
    description: 'MongoDB ID of the academic year',
  })
  @IsMongoId()
  academicYear: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the student',
  })
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @ApiProperty({
    example: 17.5,
    description: 'Score obtained by the student',
  })
  @IsNumber()
  score: number;
}
