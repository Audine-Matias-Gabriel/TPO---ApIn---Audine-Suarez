import { validateTaskCreation, validateTaskStatusChange } from "../validators/tasks.validator";
import { tasksService } from "../services/tasks.service";
import { Request, Response } from "express";

export async function createTaskController(req: Request, res: Response) {
    try {
        const errors = validateTaskCreation(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const task = await tasksService.create(req.body);
        res.status(201).json(task);
    } catch (err: any) {
        console.error('Create task error:', err);
        res.status(400).json({ message: err.message || 'Failed to create task' });
    }
}

export async function updateTaskStatusController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Task id is required" });
    }
    const { status: newStatus } = req.body;
    if (!newStatus) {
        return res.status(400).json({ error: "New status is required" });
    }

    const task = await tasksService.findById(id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    const errors = validateTaskStatusChange(task.status, newStatus);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    task.status = newStatus;
    const updatedTask = await tasksService.update(id, task);
    res.json(updatedTask);
}

export async function updateTaskController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Task id is required" });
        }
        const task = await tasksService.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        const updatedTask = await tasksService.update(id, req.body);
        res.json(updatedTask);
    } catch (err: any) {
        console.error('Update task error:', err);
        res.status(400).json({ message: err.message || 'Failed to update task' });
    }
}

export async function getAllTasksController(req: Request, res: Response) {
    const tasks = await tasksService.findAll();
    res.json(tasks);
}

export async function getTaskByIdController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Task id is required" });
    }
    const task = await tasksService.findById(id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
}

export async function deleteTaskController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Task id is required" });
    }
    const result = await tasksService.delete(id);
    if (result.affected === 0) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).send();
}