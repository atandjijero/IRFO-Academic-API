import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectController } from './subject.controller';
import { SubjectService } from 'src/application/services/subject.service';
import { Subject, SubjectSchema } from 'src/infrastructure/database/subject.schema';
import { AuthModule } from 'src/presentation/controllers/auth.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    AuthModule, 
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
