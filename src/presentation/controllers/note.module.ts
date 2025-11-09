import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteController } from './note.controller';
import { NoteService } from 'src/application/services/note.service';
import { Note, NoteSchema } from 'src/infrastructure/database/note.schema';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { CipherModule } from 'src/infrastructure/security/cipher.module'; // Assure-toi que ce chemin est correct

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    AuthModule,
    UserModule,
    CipherModule, // ✅ Import du module qui exporte CipherService
  ],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
