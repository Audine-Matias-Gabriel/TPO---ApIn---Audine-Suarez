import { Task } from '../entities/Task.entity';
import { validateTaskStatusChange } from '../validators/tasks.validator';
import { TaskRepository } from '../repositories/TaskRepository';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { UserRepository } from '../repositories/UserRepository';

const taskRepository = new TaskRepository();
const projectRepository = new ProjectRepository();
const userRepository = new UserRepository();

export const tasksService = {
    async create(taskData: any) {
        // Accept both camelCase and snake_case
        const projectId = taskData.projectId ?? taskData.project_id;
        if (!projectId) {
            throw new Error('projectId is required');
        }

        const project = await projectRepository.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const assignedId = taskData.assignedTo ?? taskData.assigned_to;
        let assignedUser: any = null;
        if (assignedId) {
            assignedUser = await userRepository.findById(assignedId);
            if (!assignedUser) {
                throw new Error('Assigned user not found');
            }
        }

        const payload: Partial<Task> = {
            title: taskData.title,
            description: taskData.description ?? taskData.desc ?? null,
            status: taskData.status ?? 'pending',
            dueDate: taskData.dueDate ?? taskData.due_date ?? null,
            assignedTo: assignedUser ?? null,
            project: project,
        };

        return taskRepository.createOne(payload);
    },

    async findAll() {
        return taskRepository.findAll();
    },

    async findById(id: string) {
        return taskRepository.findById(id);
    },

    async update(id: string, updateData: any) {
        const existing = await taskRepository.findById(id);
        if (!existing) return null;

        const updatePayload: any = {};

        if (updateData.projectId || updateData.project_id) {
            const projectId = updateData.projectId ?? updateData.project_id;
            const project = await projectRepository.findById(projectId);
            if (!project) throw new Error('Project not found');
            updatePayload.project = project;
        }

        if (updateData.assignedTo || updateData.assigned_to) {
            const assignedId = updateData.assignedTo ?? updateData.assigned_to;
            const user = await userRepository.findById(assignedId);
            if (!user) throw new Error('Assigned user not found');
            updatePayload.assignedTo = user;
        }

        if (updateData.title !== undefined) updatePayload.title = updateData.title;
        if (updateData.description !== undefined) updatePayload.description = updateData.description;
        if (updateData.status !== undefined) {
            const newStatus = updateData.status;
            const statusErrors = validateTaskStatusChange(existing.status, newStatus);
            if (statusErrors && statusErrors.length > 0) {
                throw new Error(statusErrors.join('; '));
            }
            updatePayload.status = newStatus;
        }
        if (updateData.dueDate !== undefined || updateData.due_date !== undefined) updatePayload.dueDate = updateData.dueDate ?? updateData.due_date;

        return taskRepository.updateOne(id, updatePayload);
    },

    async delete(id: string) {
        return taskRepository.deleteOne(id);
    },
};