import { Router } from 'express';
import { getAllProjectsController, getProjectByIdController, createProjectController, updateProjectController, deleteProjectController } from '../controllers/projects.controller';

export const projectsRouter = Router();

projectsRouter.get('/projects', getAllProjectsController);
projectsRouter.get('/projects/:id', getProjectByIdController);
projectsRouter.post('/projects', createProjectController);
projectsRouter.put('/projects/:id', updateProjectController);
projectsRouter.delete('/projects/:id', deleteProjectController);