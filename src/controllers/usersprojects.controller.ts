import { usersProjectsService } from '../services/usersprojects.service';
import { Request, Response } from 'express';

export async function createUserProjectController(req: Request, res: Response) {
    // Accept IDs either as params (/projects/:projectId/users/:userId) or in the JSON body
    const projectId = req.params.projectId ?? req.body.projectId ?? req.body.project_id;
    const userId = req.params.userId ?? req.body.userId ?? req.body.user_id;
    const { role } = req.body;

    if (!projectId || !userId) {
        return res.status(400).json({ error: 'Project ID and User ID are required' });
    }

    try {
        const result = await usersProjectsService.addUserToProject(projectId, userId, role);
        return res.status(201).json(result);
    } catch (err: any) {
        return res.status(400).json({ error: err.message ?? 'Unable to add user to project' });
    }
}

export async function getAllUserProjectsController(req: Request, res: Response) {
    try {
        const result = await usersProjectsService.findAll();
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({ error: err.message ?? 'Unable to retrieve user-project associations' });
    }
}

export async function getUserProjectByIdController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID parameter is required' });
    }
    try {
        const result = await usersProjectsService.findById(id);
        if (!result) {
            return res.status(404).json({ error: 'User-Project association not found' });
        }
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({ error: err.message ?? 'Unable to retrieve user-project association' });
    }
}

export async function getUserProjectByProjectAndUserController(req: Request, res: Response) {
    const { projectId, userId } = req.params;
    if (!projectId || !userId) {
        return res.status(400).json({ error: 'projectId and userId parameters are required' });
    }
    try {
        const result = await usersProjectsService.findByProjectAndUser(projectId, userId);
        if (!result) {
            return res.status(404).json({ error: 'User-Project association not found' });
        }
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({ error: err.message ?? 'Unable to retrieve user-project association' });
    }
}

export async function updateUserProjectController(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
        return res.status(400).json({ error: 'ID parameter is required' });
    }
    try {
        const result = await usersProjectsService.update(id, updateData);
        if (!result) {
            return res.status(404).json({ error: 'User-Project association not found' });
        }
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(400).json({ error: err.message ?? 'Unable to update user-project association' });
    }
}

export async function updateUserProjectByProjectAndUserController(req: Request, res: Response) {
    const { projectId, userId } = req.params;
    const updateData = req.body;
    if (!projectId || !userId) {
        return res.status(400).json({ error: 'projectId and userId parameters are required' });
    }
    try {
        const result = await usersProjectsService.updateByProjectAndUser(projectId, userId, updateData);
        if (!result) {
            return res.status(404).json({ error: 'User-Project association not found' });
        }
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(400).json({ error: err.message ?? 'Unable to update user-project association' });
    }
}

export async function deleteUserProjectByProjectAndUserController(req: Request, res: Response) {
    const { projectId, userId } = req.params;
    if (!projectId || !userId) {
        return res.status(400).json({ error: 'projectId and userId parameters are required' });
    }
    try {
        const result = await usersProjectsService.deleteByProjectAndUser(projectId, userId);
        if (!result || (result.affected !== undefined && result.affected === 0)) {
            return res.status(404).json({ error: 'User-Project association not found' });
        }
        return res.status(204).send();
    } catch (err: any) {
        return res.status(500).json({ error: err.message ?? 'Unable to delete user-project association' });
    }
}

export async function deleteUserProjectController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID parameter is required' });
    }
    try {
        await usersProjectsService.delete(id);
        return res.status(204).send();
    } catch (err: any) {
        return res.status(500).json({ error: err.message ?? 'Unable to delete user-project association' });
    }
}