import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { HistoryService } from 'src/application/services/history.service'; // Import corrigé
import { AuthGuard } from 'src/presentation/guards/auth.guard';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('History')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  private getUserRoleOrThrow(req: Request): string {
    const user = req.user;
    if (!user || !user.role) {
      throw new ForbiddenException('Utilisateur non authentifié ou rôle manquant');
    }
    return user.role;
  }

  @Roles('admin', 'supervisor')
  @Get()
  @ApiOperation({ summary: 'Historique global des actions' })
  @ApiQuery({ name: 'actionType', required: false })
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Historique global récupéré avec succès.' })
  async getAllHistory(
    @Req() req: Request,
    @Query('actionType') actionType?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const role = this.getUserRoleOrThrow(req);
    const filters = {
      actionType,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };
    return this.historyService.getAllHistory(filters, role);
  }
}
