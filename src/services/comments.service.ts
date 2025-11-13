import { Comment } from "../entities/Comment.entity";
import AppDataSource from "../db/data-source";
import { User } from "../entities/User.entity";
import { Task } from "../entities/Task.entity";

const commentRepository = AppDataSource.getRepository(Comment);
const userRepository = AppDataSource.getRepository(User);
const taskRepository = AppDataSource.getRepository(Task);

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

        const author = await userRepository.findOne({ where: { id: authorId } });
        if (!author) {
            throw new Error('Author (User) not found');
        }

        const task = await taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new Error('Task not found');
        }

        const comment = commentRepository.create({
            body: commentData.body,
            author: author,
            task: task,
        });

        return commentRepository.save(comment);
    },

    async findAll() {
        return commentRepository.find({ relations: ['author', 'task'] });
    },

    async findById(id: string) {
        return commentRepository.findOne({ where: { id }, relations: ['author', 'task'] });
    },

    async update(id: string, updateData: any) {
        const existing = await commentRepository.findOne({ where: { id } });
        if (!existing) return null;

        if (updateData.body !== undefined) existing.body = updateData.body;

        if (updateData.authorId || updateData.author_id || updateData.userId || updateData.user_id) {
            const authorId = updateData.authorId ?? updateData.author_id ?? updateData.userId ?? updateData.user_id;
            const author = await userRepository.findOne({ where: { id: authorId } });
            if (!author) throw new Error('Author (User) not found');
            existing.author = author;
        }

        if (updateData.taskId || updateData.task_id) {
            const taskId = updateData.taskId ?? updateData.task_id;
            const task = await taskRepository.findOne({ where: { id: taskId } });
            if (!task) throw new Error('Task not found');
            existing.task = task;
        }

        await commentRepository.save(existing);
        return commentRepository.findOne({ where: { id }, relations: ['author', 'task'] });
    },

    async delete(id: string) {
        return commentRepository.delete(id);
    }
};