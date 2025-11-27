import { Router } from "express";
import { getSubtasksByTaskIdController, createSubtaskController, deleteSubtaskController, updateSubtaskController } from "../controllers/subtasks.controller";

export const subtasksRouter = Router();

subtasksRouter.get('/task/:taskId', getSubtasksByTaskIdController);
subtasksRouter.post('', createSubtaskController);
subtasksRouter.put('/:id', updateSubtaskController);
subtasksRouter.delete('/:id', deleteSubtaskController);