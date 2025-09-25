import { Router } from 'express';
import { getAllCommentsController, getCommentByIdController, createCommentController, updateCommentController, deleteCommentController } from '../controllers/comments.controller';

export const commentsRouter = Router();

commentsRouter.get('', getAllCommentsController);
commentsRouter.get('/:id', getCommentByIdController);
commentsRouter.post('', createCommentController);
commentsRouter.put('/:id', updateCommentController);
commentsRouter.delete('/:id', deleteCommentController);