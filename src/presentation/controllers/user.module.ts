import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../infrastructure/database/user.schema';
import { HistoryModule } from 'src/presentation/controllers/history.module'; //  Import du module historique

@Module({
  imports: [
    AuthModule,
    HistoryModule, 
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserRepository],
  exports: [MongooseModule], // pour rendre UserModel accessible à d'autres modules
})
export class UserModule {}
