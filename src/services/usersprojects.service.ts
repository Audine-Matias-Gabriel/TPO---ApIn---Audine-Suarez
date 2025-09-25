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
    }
}
