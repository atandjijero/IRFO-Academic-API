import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteController } from './note.controller';
import { NoteService } from 'src/application/services/note.service';
import { Note, NoteSchema } from 'src/infrastructure/database/note.schema';
import { AuthModule } from 'src/presentation/controllers/auth.module'; // ✅ Import du module Auth

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    AuthModule, // ✅ Ajout ici
  ],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
