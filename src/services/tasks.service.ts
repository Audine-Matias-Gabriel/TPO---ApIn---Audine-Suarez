import AppDataSource from '../db/data-source';
import { Task } from '../entities/Task.entity';
import { Project } from '../entities/Project.entity';
import { User } from '../entities/User.entity';
import { validateTaskStatusChange } from '../validators/tasks.validator';

const taskRepository = AppDataSource.getRepository(Task);
const projectRepository = AppDataSource.getRepository(Project);
const userRepository = AppDataSource.getRepository(User);

export const tasksService = {
    async create(taskData: any) {
        // Accept both camelCase and snake_case
        const projectId = taskData.projectId ?? taskData.project_id;
        if (!projectId) {
            throw new Error('projectId is required');
        }

        const project = await projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new Error('Project not found');
        }

        const assignedId = taskData.assignedTo ?? taskData.assigned_to;
        let assignedUser: User | null = null;
        if (assignedId) {
            assignedUser = await userRepository.findOne({ where: { id: assignedId } });
            if (!assignedUser) {
                throw new Error('Assigned user not found');
            }
        }

        const task = taskRepository.create({
            title: taskData.title,
            description: taskData.description ?? taskData.desc ?? null,
            status: taskData.status ?? 'pending',
            dueDate: taskData.dueDate ?? taskData.due_date ?? null,
            assignedTo: assignedUser ?? null,
            project: project,
        });

        return taskRepository.save(task);
    },

    async findAll() {
        return taskRepository.find({ relations: ['project', 'assignedTo'] });
    },

    async findById(id: string) {
        return taskRepository.findOne({ where: { id }, relations: ['project', 'assignedTo'] });
    },

    async update(id: string, updateData: any) {
        const existing = await taskRepository.findOne({ where: { id } });
        if (!existing) return null;

        if (updateData.projectId || updateData.project_id) {
            const projectId = updateData.projectId ?? updateData.project_id;
            const project = await projectRepository.findOne({ where: { id: projectId } });
            if (!project) throw new Error('Project not found');
            existing.project = project;
        }

        if (updateData.assignedTo || updateData.assigned_to) {
            const assignedId = updateData.assignedTo ?? updateData.assigned_to;
            const user = await userRepository.findOne({ where: { id: assignedId } });
            if (!user) throw new Error('Assigned user not found');
            existing.assignedTo = user;
        }

        if (updateData.title !== undefined) existing.title = updateData.title;
        if (updateData.description !== undefined) existing.description = updateData.description;
        if (updateData.status !== undefined) {
            const newStatus = updateData.status;
            const statusErrors = validateTaskStatusChange(existing.status, newStatus);
            if (statusErrors && statusErrors.length > 0) {
                throw new Error(statusErrors.join('; '));
            }
            existing.status = newStatus;
        }
        if (updateData.dueDate !== undefined || updateData.due_date !== undefined) existing.dueDate = updateData.dueDate ?? updateData.due_date;

        await taskRepository.save(existing);
        return taskRepository.findOne({ where: { id }, relations: ['project', 'assignedTo'] });
    },

    async delete(id: string) {
        return taskRepository.delete(id);
    }
};