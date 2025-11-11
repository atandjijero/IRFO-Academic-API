import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/user.schema';
import { Model } from 'mongoose';
import { HistoryService } from 'src/application/services/history.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly historyService: HistoryService,
  ) {}

  async createUser(data: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(data);
    const saved = await user.save();
    await this.historyService.logAction(saved._id.toString(), 'create', 'Création de compte');
    return saved;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async deleteUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    await this.historyService.logAction(id, 'delete', 'Utilisateur supprimé');
    return user;
  }

  async approveUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isApprovedByAdmin: true },
      { new: true }
    );
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    await this.historyService.logAction(id, 'approve', 'Utilisateur approuvé');
    return user;
  }

  async updateUser(identifier: string, data: Partial<User>): Promise<UserDocument> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const user = isObjectId
      ? await this.userModel.findByIdAndUpdate(identifier, data, { new: true })
      : await this.userModel.findOneAndUpdate({ email: identifier }, { $set: data }, { new: true });

    if (!user) throw new NotFoundException('Utilisateur introuvable');
    await this.historyService.logAction(user._id.toString(), 'update', 'Mise à jour utilisateur');
    return user;
  }

  async verifyLoginOtp(email: string, otp: string): Promise<UserDocument> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    if (user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP invalide ou expiré');
    }

    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await this.historyService.logAction(user._id.toString(), 'verify-login-otp', 'Connexion OTP validée');
    return user.save();
  }

  async generateResetCode(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.userModel.updateOne({ email }, { resetCode: code, otpExpiresAt: expiresAt });
    await this.historyService.logAction(user._id.toString(), 'generate-reset-code', 'Code de réinitialisation généré');
    return code;
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    if (user.resetCode !== code || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Code invalide ou expiré');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne(
      { email },
      {
        password: hashed,
        resetCode: null,
        otpCode: null,
        otpExpiresAt: null,
      }
    );

    await this.historyService.logAction(user._id.toString(), 'reset-password', 'Mot de passe réinitialisé');
  }

  async save(user: UserDocument): Promise<UserDocument> {
    await this.historyService.logAction(user._id.toString(), 'save', 'Utilisateur sauvegardé');
    return user.save();
  }
}
