import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcademicYearController } from 'src/presentation/controllers/academic-year.controller';
import { AcademicYearService } from 'src/application/services/academic-year.service';
import { AcademicYear, AcademicYearSchema } from 'src/infrastructure/database/academic-year.schema';
import { AuthModule } from 'src/presentation/controllers/auth.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AcademicYear.name, schema: AcademicYearSchema }]),
    AuthModule, 
  ],
  controllers: [AcademicYearController],
  providers: [AcademicYearService],
})
export class AcademicYearModule {}

