import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Note, NoteDocument } from 'src/infrastructure/database/note.schema';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name)
    private readonly model: Model<NoteDocument>,
  ) {}

  async create(data: CreateNoteDto) {
    try {
      return await new this.model(data).save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create note');
    }
  }

  async findAll() {
    return this.model.find().populate('school subject academicYear');
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const note = await this.model
      .findById(id)
      .populate('school subject academicYear');

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(id: string, data: UpdateNoteDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    if (!Object.keys(data).length) {
      throw new BadRequestException('No data provided for update');
    }

    try {
      const updated = await this.model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      return updated;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update note');
    }
  }

  async delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const deleted = await this.model.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return deleted;
  }
}
