import { Request, Response } from "express";
import { commentsService } from "../services/comments.service";
import { validateCommentCreation, validateCommentUpdate } from "../validators/comments.validator";

export async function createCommentController(req: Request, res: Response) {
    const errors = validateCommentCreation(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    try {
        const comment = await commentsService.create(req.body);
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: "Error creating comment" });
    }
}

export async function updateCommentController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Comment id is required" });
    }
    const errors = validateCommentUpdate(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    const comment = await commentsService.findById(id);
    if (!comment) {
        return res.status(404).json({ error: "Comentario no encontrado" });
    }
    const updatedComment = await commentsService.update(id, req.body);
    res.json(updatedComment);
}

export async function getAllCommentsController(req: Request, res: Response) {
    const comments = await commentsService.findAll();
    res.json(comments);
}

export async function getCommentByIdController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Comment id is required" });
    }
    const comment = await commentsService.findById(id);
    if (!comment) {
        return res.status(404).json({ error: "Comentario no encontrado" });
    }
    res.json(comment);
}

export async function deleteCommentController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Comment id is required" });
    }
    const comment = await commentsService.findById(id);
    if (!comment) {
        return res.status(404).json({ error: "Comentario no encontrado" });
    }
    await commentsService.delete(id);
    res.json({ message: "Comentario eliminado" });
}