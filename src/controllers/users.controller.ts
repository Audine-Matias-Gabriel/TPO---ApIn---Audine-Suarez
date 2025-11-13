import { validateUserCreation } from "../validators/users.validator";
import { usersService } from "../services/users.service";
import { Request, Response } from "express";

export async function createUserController(req: Request, res: Response) {
    try {
        const errors = validateUserCreation(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const user = await usersService.create(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        console.error('Create user error:', error.message);
        return res.status(400).json({ error: error.message });
    }
}

export async function getAllUsersController(req: Request, res: Response) {
    const users = await usersService.findAll();
    res.json(users);
}

export async function getUserByIdController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "User id is required" });
    }
    const user = await usersService.findById(id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
}

export async function updateUserController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "User id is required" });
    }
    const user = await usersService.findById(id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const updatedUser = await usersService.update(id, req.body);
    res.json(updatedUser);
}

export async function deleteUserController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "User id is required" });
    }
    const result = await usersService.delete(id);
    if (result.affected === 0) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
}