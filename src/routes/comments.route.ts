import { Router } from 'express';
import { getAllCommentsController, getCommentByIdController, createCommentController, updateCommentController, deleteCommentController } from '../controllers/comments.controller';

export const commentsRouter = Router();

commentsRouter.get('/comments', getAllCommentsController);
commentsRouter.get('/comments/:id', getCommentByIdController);
commentsRouter.post('/comments', createCommentController);
commentsRouter.put('/comments/:id', updateCommentController);
commentsRouter.delete('/comments/:id', deleteCommentController);