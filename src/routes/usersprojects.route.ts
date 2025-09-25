import { Router } from 'express';
import { createUserProjectController } from '../controllers/usersprojects.controller';

export const userProjectRouter = Router();

userProjectRouter.post('/projects/:projectId/users/:userId', createUserProjectController);