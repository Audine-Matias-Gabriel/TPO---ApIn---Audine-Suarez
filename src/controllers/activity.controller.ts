// src/controllers/activity.controller.ts
import { Request, Response } from 'express';
import { ActivityRepository } from '../repositories/ActivityRepository';

export class ActivityController {
  static async getRecentActivity(req: Request, res: Response) {
    try {
      const events = await ActivityRepository.getRecentActivity();
      res.json(events);
    } catch (err) {
      console.error('Failed to fetch activity:', err);
      res.status(500).json({ message: 'Error fetching activity' });
    }
  }
}
