import AppDataSource from "../db/data-source";
import { Repository } from "typeorm";
import { Project } from "../entities/Project.entity";

export class ProjectRepository {
  private readonly repository: Repository<Project>;

  constructor() {
    this.repository = AppDataSource.getRepository(Project);
  }

  findAll(): Promise<Project[]> {
    return this.repository.find();
  }

  findById(id: string): Promise<Project | null> {
    return this.repository.findOne({ where: { id } });
  }

  async createOne(data: Partial<Project>): Promise<Project> {
    const entity = this.repository.create(data as Project);
    return this.repository.save(entity);
  }

  async updateOne(id: string, data: Partial<Project>): Promise<Project | null> {
    await this.repository.update({ id }, data);
    return this.findById(id);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
