import { Router } from "express";
import { getAllTasksController, getTaskByIdController, createTaskController, deleteTaskController, updateTaskController, updateTaskStatusController } from "../controllers/tasks.controller";

export const tasksRouter = Router();

tasksRouter.get('/tasks', getAllTasksController);
tasksRouter.get('/tasks/:id', getTaskByIdController);
tasksRouter.post('/tasks', createTaskController);
tasksRouter.put('/tasks/:id', updateTaskController);
tasksRouter.patch('/tasks/:id/status', updateTaskStatusController);
tasksRouter.delete('/tasks/:id', deleteTaskController);