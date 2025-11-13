import AppDataSource from '../db/data-source';
import { User } from '../entities/User.entity';
import { Project } from '../entities/Project.entity';
import { UserProject } from '../entities/UserProject.entity';

const userRepo = AppDataSource.getRepository(User);
const projectRepo = AppDataSource.getRepository(Project);
const userProjectRepo = AppDataSource.getRepository(UserProject);

export const usersProjectsService = {

    async addUserToProject(projectId: string, userId: string, role?: string) {
        const project = await projectRepo.findOneBy({ id: projectId });
        const user = await userRepo.findOneBy({ id: userId });
        if (!project || !user) {
            throw new Error('User or Project not found');
        }

        const existing = await userProjectRepo.findOne({
            where: {
                user: { id: user.id },
                project: { id: project.id },
            },
        });
        if (existing) {
            throw new Error('User is already in the project');
        }

        if (!role) {
            role = 'member';
        }
        if (role && !['owner', 'member'].includes(role)) {
            throw new Error('Invalid role specified');
        }

        const userProject = new UserProject();
        userProject.user = user;
        userProject.project = project;
        userProject.role = (['owner', 'member'].includes(role) ? role : 'member') as 'owner' | 'member';

        return userProjectRepo.save(userProject);
    },

    async findAll() {
        return userProjectRepo.find({ relations: ['user', 'project'] });
    },

    async findById(id: string) {
        return userProjectRepo.findOne({ where: { id }, relations: ['user', 'project'] });
    },

    async findByProjectAndUser(projectId: string, userId: string) {
        return userProjectRepo.findOne({
            where: {
                project: { id: projectId },
                user: { id: userId },
            },
            relations: ['user', 'project'],
        });
    },

    async update(id: string, updateData: any) {
        const existing = await userProjectRepo.findOne({ where: { id }, relations: ['user', 'project'] });
        if (!existing) return null;
        if (updateData.role) {
            if (!['owner', 'member'].includes(updateData.role)) {
                throw new Error('Invalid role specified');
            }
            existing.role = updateData.role;
        }
        return userProjectRepo.save(existing);
    },

    async updateByProjectAndUser(projectId: string, userId: string, updateData: any) {
        const existing = await userProjectRepo.findOne({
            where: {
                project: { id: projectId },
                user: { id: userId },
            },
            relations: ['user', 'project'],
        });
        if (!existing) return null;
        if (updateData.role) {
            if (!['owner', 'member'].includes(updateData.role)) {
                throw new Error('Invalid role specified');
            }
            existing.role = updateData.role;
        }
        return userProjectRepo.save(existing);
    },

    async delete(id: string) {
        return userProjectRepo.delete(id);
    },

    async deleteByProjectAndUser(projectId: string, userId: string) {
        const existing = await userProjectRepo.findOne({
            where: {
                project: { id: projectId },
                user: { id: userId },
            }
        });
        if (!existing) return { affected: 0 };
        return userProjectRepo.delete(existing.id);
    },
}
