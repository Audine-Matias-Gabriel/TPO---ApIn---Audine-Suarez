import { Project } from '../entities/Project.entity';
import { ProjectRepository } from '../repositories/ProjectRepository';

const projectRepository = new ProjectRepository();

export const projectsService = {
    async create(projectData: Partial<Project>) {
        return projectRepository.createOne(projectData);
    },

    async findAll() {
        return projectRepository.findAll();
    },

    async findById(id: string) {
        return projectRepository.findById(id);
    },

    async update(id: string, updateData: Partial<Project>) {
        return projectRepository.updateOne(id, updateData);
    },

    async delete(id: string) {
        return projectRepository.deleteOne(id);
    },
};