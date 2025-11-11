import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './presentation/controllers/auth.module';
import { UserModule } from './presentation/controllers/user.module';
import { SubjectModule } from './presentation/controllers/subject.module';
import { SchoolModule } from './presentation/controllers/school.module';
import { AcademicYearModule } from './presentation/controllers/academic-year.module';
import { NoteModule } from './presentation/controllers/note.module';
import { HistoryModule } from 'src/presentation/controllers/history.module';
import { CryptoModule } from 'src/crypto/crypto.module'; 
import { ActionLoggerMiddleware } from 'src/presentation/middlewares/action-logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HistoryInterceptor } from 'src/presentation/interceptors/history.interceptor';

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
    HistoryModule,
    CryptoModule, 
  ],

  providers: [
    ActionLoggerMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: HistoryInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ActionLoggerMiddleware)
      .forRoutes('*');
  }
}
