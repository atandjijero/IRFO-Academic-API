import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { History, HistoryDocument } from 'src/infrastructure/database/history.schema';
import { Model } from 'mongoose';

@Injectable()
export class HistoryService {
  constructor(@InjectModel(History.name) private historyModel: Model<HistoryDocument>) {}

  async logAction(userId: string, actionType: string, description?: string) {
    const entry = new this.historyModel({ user: userId, actionType, description });
    return entry.save();
  }

  private checkAccess(role?: string) {
    if (!role || !['admin', 'supervisor'].includes(role)) {
      throw new ForbiddenException('Accès refusé : vous n’avez pas les droits nécessaires.');
    }
  }

  async getUserHistory(
    userId: string,
    filters?: { actionType?: string; from?: Date; to?: Date },
    role?: string
  ) {
    this.checkAccess(role);

    const query: any = { user: userId };
    if (filters?.actionType) query.actionType = filters.actionType;
    if (filters?.from || filters?.to) query.createdAt = {};
    if (filters?.from) query.createdAt.$gte = filters.from;
    if (filters?.to) query.createdAt.$lte = filters.to;

    return this.historyModel
      .find(query)
      .populate('user', 'email firstName lastName')
      .sort({ createdAt: -1 });
  }

  async getFullUserHistory(userId: string, role?: string) {
    this.checkAccess(role);

    return this.historyModel
      .find({ user: userId })
      .populate('user', 'email firstName lastName')
      .sort({ createdAt: -1 });
  }

  async getAllHistory(
    filters?: { actionType?: string; from?: Date; to?: Date },
    role?: string
  ) {
    this.checkAccess(role);

    const query: any = {};
    if (filters?.actionType) query.actionType = filters.actionType;
    if (filters?.from || filters?.to) query.createdAt = {};
    if (filters?.from) query.createdAt.$gte = filters.from;
    if (filters?.to) query.createdAt.$lte = filters.to;

    return this.historyModel
      .find(query)
      .populate('user', 'email firstName lastName')
      .sort({ createdAt: -1 });
  }

  async getActionsByRoute(
    filters: { path: string; actionType?: string; from?: Date; to?: Date },
    role?: string
  ) {
    this.checkAccess(role);

    const query: any = {
      description: { $regex: filters.path, $options: 'i' },
    };

    if (filters.actionType) query.actionType = filters.actionType;
    if (filters.from || filters.to) query.createdAt = {};
    if (filters.from) query.createdAt.$gte = filters.from;
    if (filters.to) query.createdAt.$lte = filters.to;

    return this.historyModel
      .find(query)
      .populate('user', 'email firstName lastName')
      .sort({ createdAt: -1 });
  }
}
