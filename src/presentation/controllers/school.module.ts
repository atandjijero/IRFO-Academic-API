import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolController } from 'src/presentation/controllers/school.controller';
import { SchoolService } from 'src/application/services/school.service';
import { School, SchoolSchema } from 'src/infrastructure/database/school.schema';
import { AuthModule } from 'src/presentation/controllers/auth.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
    AuthModule, 
  ],
  controllers: [SchoolController],
  providers: [SchoolService],
})
export class SchoolModule {}
