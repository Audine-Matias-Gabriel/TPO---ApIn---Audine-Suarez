import { Comment } from "../entities/Comment.entity";
import { CommentRepository } from "../repositories/CommentRepository";
import { UserRepository } from "../repositories/UserRepository";
import { TaskRepository } from "../repositories/TaskRepository";

const commentRepository = new CommentRepository();
const userRepository = new UserRepository();
const taskRepository = new TaskRepository();

export const commentsService = {
    async create(commentData: any) {
        // Accept both camelCase and snake_case
        const authorId = commentData.authorId ?? commentData.author_id ?? commentData.userId ?? commentData.user_id;
        if (!authorId) {
            throw new Error('authorId is required');
        }

        const taskId = commentData.taskId ?? commentData.task_id;
        if (!taskId) {
            throw new Error('taskId is required');
        }

        const author = await userRepository.findById(authorId);
        if (!author) {
            throw new Error('Author (User) not found');
        }

        const task = await taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        const payload: Partial<Comment> = {
            body: commentData.body,
            author: author,
            task: task,
        };

        return commentRepository.createOne(payload);
    },

    async findAll() {
        return commentRepository.findAll();
    },

    async findById(id: string) {
        return commentRepository.findById(id);
    },

    async update(id: string, updateData: any) {
        const existing = await commentRepository.findById(id);
        if (!existing) return null;

        const payload: any = {};
        if (updateData.body !== undefined) payload.body = updateData.body;

        if (updateData.authorId || updateData.author_id || updateData.userId || updateData.user_id) {
            const authorId = updateData.authorId ?? updateData.author_id ?? updateData.userId ?? updateData.user_id;
            const author = await userRepository.findById(authorId);
            if (!author) throw new Error('Author (User) not found');
            payload.author = author;
        }

        if (updateData.taskId || updateData.task_id) {
            const taskId = updateData.taskId ?? updateData.task_id;
            const task = await taskRepository.findById(taskId);
            if (!task) throw new Error('Task not found');
            payload.task = task;
        }

        return commentRepository.updateOne(id, payload);
    },

    async delete(id: string) {
        return commentRepository.deleteOne(id);
    }
};