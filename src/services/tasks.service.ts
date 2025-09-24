import { Task } from '../entities/Task.entity';
import AppDataSource from '../db/data-source';

const taskRepository = AppDataSource.getRepository(Task);

export const tasksService = {
    async create(taskData: Partial<Task>) {
        const task = taskRepository.create(taskData);
        return taskRepository.save(task);
    },

    async findAll() {
        return taskRepository.find();
    },

    async findById(id: string) {
        return taskRepository.findOne({ where: { id } });
    },

    async update(id: string, updateData: Partial<Task>) {
        await taskRepository.update(id, updateData);
        return taskRepository.findOne({ where: { id } });
    },

    async delete(id: string) {
        return taskRepository.delete(id);
    }
};