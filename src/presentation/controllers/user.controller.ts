import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateUserDto } from 'src/application/dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userRepo: UserRepository) {}

  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Voir tous les utilisateurs (admin uniquement)' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs retournée avec succès.' })
  async findAll() {
    return this.userRepo.findAll();
  }

  @Roles('admin')
  @Put('approve/:id')
  @ApiOperation({ summary: 'Valider ou approuver un utilisateur (admin uniquement)' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur à approuver" })
  @ApiResponse({ status: 200, description: 'Utilisateur approuvé avec succès.' })
  async approve(@Param('id') id: string) {
    return this.userRepo.approveUser(id);
  }

  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur (admin uniquement)' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur à mettre à jour" })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour avec succès.' })
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userRepo.updateUser(id, data);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur (admin uniquement)' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur à supprimer" })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé avec succès.' })
  async delete(@Param('id') id: string) {
    return this.userRepo.deleteUser(id);
  }

  @Roles('user', 'etudiant', 'surveillant', 'comptabilite', 'admin')
  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil de l’utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur retourné avec succès.' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
  async getProfile(@Req() req: Request) {
    const email = (req.user as { email: string }).email;

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'email ${email} introuvable`);
    }

    return user;
  }
}
