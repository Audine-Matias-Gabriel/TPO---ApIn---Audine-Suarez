import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';

export const activityRouter = Router();

activityRouter.get('/', ActivityController.getRecentActivity);
