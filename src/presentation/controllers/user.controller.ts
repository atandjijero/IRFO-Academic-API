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
  BadRequestException,
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
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userRepo: UserRepository) {}

  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'View all users (admin only)' })
  @ApiResponse({ status: 200, description: 'User list retrieved successfully.' })
  async findAll() {
    return this.userRepo.findAll();
  }

  @Roles('admin')
  @Put('approve/:id')
  @ApiOperation({ summary: 'Approve a user (admin only)' })
  @ApiParam({ name: 'id', description: "ID of the user to approve" })
  @ApiResponse({ status: 200, description: 'User approved successfully.' })
  async approve(@Param('id') id: string) {
    return this.userRepo.approveUser(id);
  }

  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update a user (admin only)' })
  @ApiParam({ name: 'id', description: "ID of the user to update" })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userRepo.updateUser(id, data);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiParam({ name: 'id', description: "ID of the user to delete" })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  async delete(@Param('id') id: string) {
    return this.userRepo.deleteUser(id);
  }

  @Roles('user', 'student', 'supervisor', 'accountant', 'admin')
  @Get('me')
  @ApiOperation({ summary: 'Get the profile of the logged-in user' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getProfile(@Req() req: Request) {
    const email = (req.user as { email: string }).email;
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  @Roles('admin')
  @Put('status/:id')
  @ApiOperation({ summary: 'Update user status (admin only)' })
  @ApiParam({ name: 'id', description: "ID of the user to update" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'inactive', 'blocked'],
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({ status: 200, description: 'User status updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid status value.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    const allowedStatuses = ['active', 'inactive', 'blocked'];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        "Invalid status. Please choose one of: 'active', 'inactive', 'blocked'."
      );
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.status = status as 'active' | 'inactive' | 'blocked';
    return this.userRepo.save(user);
  }
}
