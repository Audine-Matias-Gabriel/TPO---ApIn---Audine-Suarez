import { Router } from 'express';
import { getAllProjectsController, getProjectByIdController, createProjectController, updateProjectController, deleteProjectController } from '../controllers/projects.controller';

export const projectsRouter = Router();

projectsRouter.get('', getAllProjectsController);
projectsRouter.get('/:id', getProjectByIdController);
projectsRouter.post('', createProjectController);
projectsRouter.put('/:id', updateProjectController);
projectsRouter.delete('/:id', deleteProjectController);