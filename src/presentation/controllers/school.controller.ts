import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { SchoolService } from 'src/application/services/school.service';
import { CreateSchoolDto } from 'src/application/dto/create-school.dto';
import { UpdateSchoolDto } from 'src/application/dto/update-school.dto';
import { AuthGuard } from 'src/presentation/guards/auth.guard';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Schools')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('schools')
export class SchoolController {
  constructor(private readonly service: SchoolService) {}

  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new school' })
  @ApiBody({ type: CreateSchoolDto })
  @ApiResponse({ status: 201, description: 'School created successfully.' })
  create(@Body() data: CreateSchoolDto) {
    return this.service.create(data);
  }

  @Roles('admin', 'supervisor', 'student', 'accountant')
  @Get()
  @ApiOperation({ summary: 'Get all schools' })
  @ApiResponse({ status: 200, description: 'List of schools retrieved successfully.' })
  findAll() {
    return this.service.findAll();
  }

  @Roles('admin', 'supervisor', 'student', 'accountant')
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific school by ID' })
  @ApiParam({ name: 'id', description: 'ID of the school to retrieve' })
  @ApiResponse({ status: 200, description: 'School retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'School not found.' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update a school' })
  @ApiParam({ name: 'id', description: 'ID of the school to update' })
  @ApiBody({ type: UpdateSchoolDto })
  @ApiResponse({ status: 200, description: 'School updated successfully.' })
  @ApiResponse({ status: 404, description: 'School not found.' })
  update(@Param('id') id: string, @Body() data: UpdateSchoolDto) {
    return this.service.update(id, data);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a school' })
  @ApiParam({ name: 'id', description: 'ID of the school to delete' })
  @ApiResponse({ status: 200, description: 'School deleted successfully.' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
