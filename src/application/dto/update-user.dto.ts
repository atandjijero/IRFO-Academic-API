import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Rôle mis à jour',
    enum: ['admin', 'student', 'supervisor', 'accountant'],
  })
  @IsOptional()
  @IsIn(['admin', 'student', 'supervisor', 'accountant'])
  role?: 'admin' | 'student' | 'supervisor' | 'accountant';

  @ApiPropertyOptional({
    description: 'Statut mis à jour',
    enum: ['active', 'inactive', 'blocked'],
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'blocked'])
  status?: 'active' | 'inactive' | 'blocked';

  // autres propriétés optionnelles...
}
