import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from 'src/application/services/note.service';
import { CreateNoteDto } from 'src/application/dto/create-note.dto';
import { UpdateNoteDto } from 'src/application/dto/update-note.dto';
import { AuthGuard } from 'src/presentation/guards/auth.guard';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Notes')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly service: NoteService) {}

  @Roles('admin', 'supervisor')
  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({ status: 201, description: 'Note created successfully.' })
  create(@Body() data: CreateNoteDto) {
    return this.service.create(data);
  }

  @Roles('admin', 'student')
  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiResponse({ status: 200, description: 'List of notes retrieved successfully.' })
  findAll() {
    return this.service.findAll();
  }

  @Roles('admin','student')
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific note by ID' })
  @ApiParam({ name: 'id', description: 'ID of the note to retrieve' })
  @ApiResponse({ status: 200, description: 'Note retrieved successfully.' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Roles('admin', 'supervisor')
  @Put(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'ID of the note to update' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({ status: 200, description: 'Note updated successfully.' })
  update(@Param('id') id: string, @Body() data: UpdateNoteDto) {
    return this.service.update(id, data);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'ID of the note to delete' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully.' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
