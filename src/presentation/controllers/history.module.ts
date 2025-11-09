import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from 'src/infrastructure/database/history.schema';
import { HistoryService } from 'src/application/services/history.service';
import { HistoryController } from 'src/presentation/controllers/history.controller';
import { AuthModule } from 'src/presentation/controllers/auth.module'; // Chemin confirmé

@Module({
  imports: [
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
    forwardRef(() => AuthModule), // Résout la dépendance circulaire
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
