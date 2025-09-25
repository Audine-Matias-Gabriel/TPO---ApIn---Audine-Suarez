import { Router } from 'express';
import { getAllUsersController, getUserByIdController, createUserController, deleteUserController, updateUserController } from '../controllers/users.controller';

export const usersRouter = Router();

usersRouter.get('', getAllUsersController);
usersRouter.get('/:id', getUserByIdController);
usersRouter.post('', createUserController);
usersRouter.put('/:id', updateUserController);
usersRouter.delete('/:id', deleteUserController);