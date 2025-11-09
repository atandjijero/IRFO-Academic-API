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
import { User, UserDocument } from 'src/infrastructure/database/user.schema';
import { CipherService } from 'src/infrastructure/security/cipher.service';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name)
    private readonly model: Model<NoteDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly cipher: CipherService,
  ) {}

  async create(data: CreateNoteDto) {
    if (!isValidObjectId(data.student)) {
      throw new BadRequestException('Invalid student ID');
    }

    const student = await this.userModel.findById(data.student);
    if (!student || student.role !== 'student') {
      throw new BadRequestException('The referenced user must be a student');
    }

    try {
      const encryptedScore = this.cipher.encrypt(data.score.toString());
      const noteToSave = { ...data, score: encryptedScore };
      return await new this.model(noteToSave).save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create note');
    }
  }

  async findAll(
    currentUser: UserDocument,
    filters: Partial<Record<'school' | 'subject' | 'academicYear' | 'student', string>> = {},
  ) {
    const query: any = {};

    if (currentUser.role === 'student') {
      query.student = currentUser._id;
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value && isValidObjectId(value)) {
        query[key] = value;
      }
    }

    const notes = await this.model
      .find(query)
      .populate('school subject academicYear student');

    return notes.map((note) => {
      const plain = note.toObject();
      let decryptedScore: number | null = null;

      try {
        if (plain.score) {
          decryptedScore = parseFloat(this.cipher.decrypt(plain.score));
        }
      } catch (err) {
        console.warn(`Erreur de déchiffrement pour la note ${plain._id}:`, err.message);
      }

      return {
        ...plain,
        score: decryptedScore,
      };
    });
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const note = await this.model
      .findById(id)
      .populate('school subject academicYear student');

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    const plain = note.toObject();
    let decryptedScore: number | null = null;

    try {
      if (plain.score) {
        decryptedScore = parseFloat(this.cipher.decrypt(plain.score));
      }
    } catch (err) {
      console.warn(`Erreur de déchiffrement pour la note ${plain._id}:`, err.message);
    }

    return {
      ...plain,
      score: decryptedScore,
    };
  }

  async update(id: string, data: UpdateNoteDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    if (!Object.keys(data).length) {
      throw new BadRequestException('No data provided for update');
    }

    if (data.student) {
      if (!isValidObjectId(data.student)) {
        throw new BadRequestException('Invalid student ID');
      }

      const student = await this.userModel.findById(data.student);
      if (!student || student.role !== 'student') {
        throw new BadRequestException('The referenced user must be a student');
      }
    }

    const updatePayload: any = { ...data };

    if (data.score !== undefined) {
      updatePayload.score = this.cipher.encrypt(data.score.toString());
    }

    try {
      const updated = await this.model.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      const plain = updated.toObject();
      let decryptedScore: number | null = null;

      try {
        if (plain.score) {
          decryptedScore = parseFloat(this.cipher.decrypt(plain.score));
        }
      } catch (err) {
        console.warn(`Erreur de déchiffrement pour la note ${plain._id}:`, err.message);
      }

      return {
        ...plain,
        score: decryptedScore,
      };
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
