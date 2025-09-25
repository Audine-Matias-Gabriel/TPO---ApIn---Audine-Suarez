import { usersProjectsService } from '../services/usersprojects.service';
import { Request, Response } from 'express';

export async function createUserProjectController(req: Request, res: Response) {
    const { projectId, userId } = req.params;
    const { role } = req.body;
    if (!projectId || !userId) {
        return res.status(400).json({ error: 'Project ID and User ID are required' });
    }
    const result = await usersProjectsService.addUserToProject(
        (projectId),
        (userId),
        role
    );
    res.status(201).json(result);
}