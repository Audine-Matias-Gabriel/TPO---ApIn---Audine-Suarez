import { Router } from 'express';
import { getAllUsersController, getUserByIdController, createUserController, deleteUserController, updateUserController } from '../controllers/users.controller';

export const usersRouter = Router();

usersRouter.get('/users', getAllUsersController);
usersRouter.get('/users/:id', getUserByIdController);
usersRouter.post('/users', createUserController);
usersRouter.put('/users/:id', updateUserController);
usersRouter.delete('/users/:id', deleteUserController);