import { Router } from 'express';
import { createUserProjectController, getAllUserProjectsController, getUserProjectByIdController, getUserProjectByProjectAndUserController, updateUserProjectController, updateUserProjectByProjectAndUserController, deleteUserProjectController, deleteUserProjectByProjectAndUserController } from '../controllers/usersprojects.controller';

export const userProjectRouter = Router();
// Accept JSON body with `userId` and `projectId`
userProjectRouter.post('', createUserProjectController);

// Alternate: accept both IDs in the URL as /usersProjects/:projectId/:userId
// Controller already supports params or body; adding this keeps backward compatibility.
userProjectRouter.post('/:projectId/:userId', createUserProjectController);
userProjectRouter.get('', getAllUserProjectsController);
userProjectRouter.get('/:id', getUserProjectByIdController);
userProjectRouter.put('/:id', updateUserProjectController);
userProjectRouter.delete('/:id', deleteUserProjectController);
// GET or PUT by projectId + userId
userProjectRouter.get('/:projectId/:userId', getUserProjectByProjectAndUserController);
userProjectRouter.put('/:projectId/:userId', updateUserProjectByProjectAndUserController);
userProjectRouter.delete('/:projectId/:userId', deleteUserProjectByProjectAndUserController);