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