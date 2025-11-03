import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './presentation/controllers/auth.module';
import { UserModule } from './presentation/controllers/user.module';
import { SubjectModule } from './presentation/controllers/subject.module';
import { SchoolModule } from 'src/presentation/controllers/school.module';
import { AcademicYearModule } from 'src/presentation/controllers/academic-year.module';
import { NoteModule } from 'src/presentation/controllers/note.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UserModule,
    SubjectModule,
    SchoolModule,
    AcademicYearModule,
    NoteModule, 
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
