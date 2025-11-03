import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subject, SubjectDocument } from 'src/infrastructure/database/subject.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateSubjectDto } from 'src/application/dto/create-subject.dto';
import { UpdateSubjectDto } from 'src/application/dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(@InjectModel(Subject.name) private readonly model: Model<SubjectDocument>) {}

  async create(data: CreateSubjectDto) {
    return new this.model(data).save();
  }

  async findAll() {
    return this.model.find();
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const subject = await this.model.findById(id);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async update(id: string, data: UpdateSubjectDto) {
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
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }

      return updated;
    } catch (error) {
      console.error('Update error:', error);
      throw new InternalServerErrorException('Failed to update subject');
    }
  }

  async delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return deleted;
  }
}
