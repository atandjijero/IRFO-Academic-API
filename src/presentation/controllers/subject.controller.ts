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
import { SubjectService } from 'src/application/services/subject.service';
import { CreateSubjectDto } from 'src/application/dto/create-subject.dto';
import { UpdateSubjectDto } from 'src/application/dto/update-subject.dto';
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

@ApiTags('Subjects')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('subjects')
export class SubjectController {
  constructor(private readonly service: SubjectService) {}

  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiBody({ type: CreateSubjectDto })
  @ApiResponse({ status: 201, description: 'Subject created successfully.' })
  create(@Body() data: CreateSubjectDto) {
    return this.service.create(data);
  }

  @Roles('admin', 'supervisor', 'student')
  @Get()
  @ApiOperation({ summary: 'Get all subjects' })
  @ApiResponse({ status: 200, description: 'List of subjects retrieved successfully.' })
  findAll() {
    return this.service.findAll();
  }

  @Roles('admin', 'supervisor', 'student')
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific subject by ID' })
  @ApiParam({ name: 'id', description: 'ID of the subject to retrieve' })
  @ApiResponse({ status: 200, description: 'Subject retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Subject not found.' })
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update a subject' })
  @ApiParam({ name: 'id', description: 'ID of the subject to update' })
  @ApiBody({ type: UpdateSubjectDto })
  @ApiResponse({ status: 200, description: 'Subject updated successfully.' })
  @ApiResponse({ status: 404, description: 'Subject not found.' })
  update(@Param('id') id: string, @Body() data: UpdateSubjectDto) {
    return this.service.update(id, data);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subject' })
  @ApiParam({ name: 'id', description: 'ID of the subject to delete' })
  @ApiResponse({ status: 200, description: 'Subject deleted successfully.' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
