import { Subtask } from "../entities/Subtask.entity";
import { SubtaskRepository } from "../repositories/SubtaskRepository";
import { TaskRepository } from "../repositories/TaskRepository";

const subtaskRepository = new SubtaskRepository();

export const subtasksService = {
    async create(subtaskData: any) {
        const taskRepository = new TaskRepository();
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


};