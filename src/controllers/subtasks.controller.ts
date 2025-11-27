import { subtasksService } from "../services/subtasks.service";
import { Request, Response } from "express";

export async function createSubtaskController(req: Request, res: Response) {
    try {
        const subtask = await subtasksService.create(req.body);
        res.status(201).json(subtask);
    } catch (err: any) {
        console.error('Create subtask error:', err);
        res.status(400).json({ message: err.message || 'Failed to create subtask' });
    }
}

export async function getSubtasksByTaskIdController(req: Request, res: Response) {
    try {
        console.log('Getting subtasks for task ID:', req.params.taskId);
        const taskId = req.params.taskId;
        if (!taskId) {
            res.status(400).json({ message: 'Task ID is required' });
            return;
        }
        const subtasks = await subtasksService.getByTaskId(taskId);
        res.status(200).json(subtasks);
    } catch (err: any) {
        console.error('Get subtasks error:', err);
        res.status(400).json({ message: err.message || 'Failed to get subtasks' });
    }
}

export async function deleteSubtaskController(req: Request, res: Response) {
    try {
        const subtaskId = req.params.id;
        if (!subtaskId) {
            res.status(400).json({ message: 'Subtask ID is required' });
            return;
        }
        await subtasksService.delete(subtaskId);
        res.status(204).send();
    } catch (err: any) {
        console.error('Delete subtask error:', err);
        res.status(400).json({ message: err.message || 'Failed to delete subtask' });
    }
}

export async function updateSubtaskController(req: Request, res: Response) {
    try {
        const subtaskId = req.params.id;
        if (!subtaskId) {
            res.status(400).json({ message: 'Subtask ID is required' });
            return;
        }
        const updatedSubtask = await subtasksService.update(subtaskId, req.body);
        res.status(200).json(updatedSubtask);
    } catch (err: any) {
        console.error('Update subtask error:', err);
        res.status(400).json({ message: err.message || 'Failed to update subtask' });
    }
}