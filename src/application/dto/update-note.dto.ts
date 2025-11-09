import { IsOptional, IsNumber, IsMongoId } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiPropertyOptional({ example: '653a1f2b8c9d3e0012a4b1f4' })
  @IsMongoId()
  @IsOptional()
  student?: string;

  @ApiPropertyOptional({ example: 18.5 })
  @IsNumber()
  @IsOptional()
  score?: number;
}
