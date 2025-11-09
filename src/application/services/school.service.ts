import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { School, SchoolDocument } from 'src/infrastructure/database/school.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateSchoolDto } from 'src/application/dto/create-school.dto';
import { UpdateSchoolDto } from 'src/application/dto/update-school.dto';

@Injectable()
export class SchoolService {
  constructor(@InjectModel(School.name) private readonly model: Model<SchoolDocument>) {}

  async create(data: CreateSchoolDto) {
    return new this.model(data).save();
  }

  async findAll() {
    return this.model.find();
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const school = await this.model.findById(id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, data: UpdateSchoolDto) {
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
        throw new NotFoundException(`School with ID ${id} not found`);
      }

      return updated;
    } catch (error) {
      console.error('Update error:', error);
      throw new InternalServerErrorException('Failed to update school');
    }
  }

  async delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return deleted;
  }
}
