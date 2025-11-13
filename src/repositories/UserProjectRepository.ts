import AppDataSource from "../db/data-source";
import { Repository } from "typeorm";
import { UserProject } from "../entities/UserProject.entity";

export class UserProjectRepository {
  private readonly repository: Repository<UserProject>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserProject);
  }

  findAll(): Promise<UserProject[]> {
    return this.repository.find({ relations: ['user', 'project'] });
  }

  findById(id: string): Promise<UserProject | null> {
    return this.repository.findOne({ where: { id }, relations: ['user', 'project'] });
  }

  async findByProjectAndUser(projectId: string, userId: string): Promise<UserProject | null> {
    return this.repository.findOne({ where: { project: { id: projectId }, user: { id: userId } }, relations: ['user', 'project'] });
  }

  async createOne(data: Partial<UserProject>): Promise<UserProject> {
    const entity = this.repository.create(data as UserProject);
    return this.repository.save(entity);
  }

  async updateOne(id: string, data: Partial<UserProject>): Promise<UserProject | null> {
    await this.repository.update({ id }, data);
    return this.findById(id);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
