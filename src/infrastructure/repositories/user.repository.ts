import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Création d’un nouvel utilisateur
  async createUser(data: Partial<User>) {
    const user = new this.userModel(data);
    return user.save();
  }

  // Recherche par email
  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  // Vérification du code OTP
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

  // Validation par l’admin
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

  // Liste de tous les utilisateurs
  async findAll() {
    return this.userModel.find();
  }

  // Mise à jour d’un utilisateur
  async updateUser(id: string, data: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return user;
  }

  // Suppression d’un utilisateur
  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return user;
  }
}
