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
import { CreateAcademicYearDto } from 'src/application/dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from 'src/application/dto/update-academic-year.dto';
import { AcademicYearService } from 'src/application/services/academic-year.service';
import { AuthGuard } from 'src/presentation/guards/auth.guard';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Academic Years')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('academic-years')
export class AcademicYearController {
  constructor(private readonly service: AcademicYearService) {}

  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new academic year' })
  @ApiResponse({ status: 201, description: 'Academic year created successfully.' })
  create(@Body() data: CreateAcademicYearDto) {
    return this.service.create(data);
  }

  @Roles('admin', 'supervisor', 'student')
  @Get()
  @ApiOperation({ summary: 'Get all academic years' })
  @ApiResponse({ status: 200, description: 'List of academic years retrieved successfully.' })
  findAll() {
    return this.service.findAll();
  }

  @Roles('admin', 'supervisor', 'student')
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific academic year by ID' })
  @ApiParam({ name: 'id', description: 'ID of the academic year to retrieve' })
  @ApiResponse({ status: 200, description: 'Academic year retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Academic year not found.' })
  async findOne(@Param('id') id: string) {
    const year = await this.service.findById(id);
    if (!year) {
      throw new NotFoundException(`Academic year with ID ${id} not found`);
    }
    return year;
  }

  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update an academic year' })
  @ApiParam({ name: 'id', description: 'ID of the academic year to update' })
  @ApiResponse({ status: 200, description: 'Academic year updated successfully.' })
  @ApiResponse({ status: 404, description: 'Academic year not found.' })
  async update(@Param('id') id: string, @Body() data: UpdateAcademicYearDto) {
    const updated = await this.service.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Academic year with ID ${id} not found`);
    }
    return updated;
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an academic year' })
  @ApiParam({ name: 'id', description: 'ID of the academic year to delete' })
  @ApiResponse({ status: 200, description: 'Academic year deleted successfully.' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
