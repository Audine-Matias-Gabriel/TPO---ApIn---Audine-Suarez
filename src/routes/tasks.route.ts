import { Router } from "express";
import { getAllTasksController, getTaskByIdController, getTaskByUserIdController, createTaskController, deleteTaskController, updateTaskController, updateTaskStatusController } from "../controllers/tasks.controller";

export const tasksRouter = Router();

tasksRouter.get('', getAllTasksController);
tasksRouter.get('/:id', getTaskByIdController);
tasksRouter.get('/:assignedTo', getTaskByUserIdController);
tasksRouter.post('', createTaskController);
tasksRouter.put('/:id', updateTaskController);
tasksRouter.patch('/:id/status', updateTaskStatusController);
tasksRouter.delete('/:id', deleteTaskController);