import { Injectable } from '@nestjs/common';
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
    if (!user || user.otpCode !== otp || user.otpExpiresAt < new Date()) {
      throw new Error('OTP invalide ou expiré');
    }
    user.isEmailVerified = true;
    return user.save();
  }

  async approveUser(id: string) {
    return this.userModel.findByIdAndUpdate(id, { isApprovedByAdmin: true }, { new: true });
  }

  async findAll() {
    return this.userModel.find();
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
  
}
