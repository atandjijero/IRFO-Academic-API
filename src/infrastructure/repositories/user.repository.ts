import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: Partial<User>) {
    const user = new this.userModel(data);
    return user.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.otpCode !== otp || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP invalide ou expiré');
    }

    user.isEmailVerified = true;
    return user.save();
  }

  async approveUser(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isApprovedByAdmin: true },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return user;
  }

  async findAll() {
    return this.userModel.find();
  }

  async updateUser(id: string, data: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return user;
  }

  async save(user: UserDocument): Promise<UserDocument> {
    return user.save();
  }
}
