import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../infrastructure/database/user.schema';

@Module({
  imports: [
    AuthModule, // ✅ pour JwtService
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // ✅ pour UserModel
  ],
  controllers: [UserController],
  providers: [UserRepository],
})
export class UserModule {}
