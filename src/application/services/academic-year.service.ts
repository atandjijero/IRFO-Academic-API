import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AcademicYear, AcademicYearDocument } from 'src/infrastructure/database/academic-year.schema';
import { Model } from 'mongoose';
import { CreateAcademicYearDto } from 'src/application/dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from 'src/application/dto/update-academic-year.dto';

@Injectable()
export class AcademicYearService {
  constructor(@InjectModel(AcademicYear.name) private readonly model: Model<AcademicYearDocument>) {}

  async create(data: CreateAcademicYearDto) {
    return new this.model(data).save();
  }

  async findAll() {
    return this.model.find();
  }

  async findById(id: string) {
    const year = await this.model.findById(id);
    if (!year) {
      throw new NotFoundException(`Academic year with ID ${id} not found`);
    }
    return year;
  }

  async update(id: string, data: UpdateAcademicYearDto) {
    if (!Object.keys(data).length) {
      throw new BadRequestException('No data provided for update');
    }

    const updated = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new NotFoundException(`Academic year with ID ${id} not found`);
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Academic year with ID ${id} not found`);
    }
    return deleted;
  }
}
