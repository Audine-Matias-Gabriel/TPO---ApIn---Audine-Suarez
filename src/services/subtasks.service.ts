import { Subtask } from "../entities/Subtask.entity";
import { SubtaskRepository } from "../repositories/SubtaskRepository";
import { TaskRepository } from "../repositories/TaskRepository";

const subtaskRepository = new SubtaskRepository();
const taskRepository = new TaskRepository();

export const subtasksService = {
    async create(subtaskData: any) {
        const task = await taskRepository.findById(subtaskData.taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        let nextOrder: number;

        if (typeof subtaskData.order === "number") {
            nextOrder = subtaskData.order;
        } else {
            const lastSubtask = await subtaskRepository.findLastOrderForTask(task.id);

            nextOrder = lastSubtask ? lastSubtask.order + 1 : 1;
        }

        const payload: Partial<Subtask> = {
            title: subtaskData.title,
            description: subtaskData.description ?? subtaskData.desc ?? null,
            status: subtaskData.status ?? 'pending',
            order: nextOrder,
            task: task,
        };
        return subtaskRepository.createOne(payload);
    },

    async getByTaskId(taskId: string) {
        const task = await taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        return task.subtasks;
    },

    async delete(subtaskId: string) {
        const subtask = await subtaskRepository.findById(subtaskId);
        if (!subtask) {
            throw new Error('Subtask not found');
        }
        await subtaskRepository.deleteOne(subtaskId);
    },

    async update(subtaskId: string, updateData: any) {
        const subtask = await subtaskRepository.findById(subtaskId);
        if (!subtask) {
            throw new Error('Subtask not found');
        }
        Object.assign(subtask, updateData);
        return subtaskRepository.createOne(subtask);
    },

};