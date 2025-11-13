import { UserRepository } from '../repositories/UserRepository';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { UserProjectRepository } from '../repositories/UserProjectRepository';

const userRepo = new UserRepository();
const projectRepo = new ProjectRepository();
const userProjectRepo = new UserProjectRepository();

export const usersProjectsService = {

    async addUserToProject(projectId: string, userId: string, role?: string) {
        const project = await projectRepo.findById(projectId);
        const user = await userRepo.findById(userId);
        if (!project || !user) {
            throw new Error('User or Project not found');
        }

        const existing = await userProjectRepo.findByProjectAndUser(projectId, userId);
        if (existing) {
            throw new Error('User is already in the project');
        }

        if (!role) {
            role = 'member';
        }
        if (role && !['owner', 'member'].includes(role)) {
            throw new Error('Invalid role specified');
        }

        const payload = {
            user,
            project,
            role: (['owner', 'member'].includes(role) ? role : 'member') as 'owner' | 'member',
        };

        return userProjectRepo.createOne(payload as any);
    },

    async findAll() {
        return userProjectRepo.findAll();
    },

    async findById(id: string) {
        return userProjectRepo.findById(id);
    },

    async findByProjectAndUser(projectId: string, userId: string) {
        return userProjectRepo.findByProjectAndUser(projectId, userId);
    },

    async update(id: string, updateData: any) {
        const existing = await userProjectRepo.findById(id);
        if (!existing) return null;
        if (updateData.role) {
            if (!['owner', 'member'].includes(updateData.role)) {
                throw new Error('Invalid role specified');
            }
            return userProjectRepo.updateOne(id, { role: updateData.role } as any);
        }
        return existing;
    },

    async updateByProjectAndUser(projectId: string, userId: string, updateData: any) {
        const existing = await userProjectRepo.findByProjectAndUser(projectId, userId);
        if (!existing) return null;
        if (updateData.role) {
            if (!['owner', 'member'].includes(updateData.role)) {
                throw new Error('Invalid role specified');
            }
            return userProjectRepo.updateOne(existing.id, { role: updateData.role } as any);
        }
        return existing;
    },

    async delete(id: string) {
        return userProjectRepo.deleteOne(id);
    },

    async deleteByProjectAndUser(projectId: string, userId: string) {
        const existing = await userProjectRepo.findByProjectAndUser(projectId, userId);
        if (!existing) return { affected: 0 } as any;
        await userProjectRepo.deleteOne(existing.id);
        return { affected: 1 } as any;
    },
};
