import { Project } from '../entities/Project.entity';
import AppDataSource from '../db/data-source';

const projectRepository = AppDataSource.getRepository(Project);

export const projectsService = {
    async create(projectData: Partial<Project>) {
        const project = projectRepository.create(projectData);
        return projectRepository.save(project);
    },

    async findAll() {
        return projectRepository.find();
    },

    async findById(id: string) {
        return projectRepository.findOne({ where: { id } });
    },

    async update(id: string, updateData: Partial<Project>) {
        await projectRepository.update(id, updateData);
        return projectRepository.findOne({ where: { id } });
    },

    async delete(id: string) {
        return projectRepository.delete(id);
    }
};