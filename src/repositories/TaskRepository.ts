import AppDataSource from "../db/data-source";
import { Repository, DeleteResult } from "typeorm";
import { Task } from "../entities/Task.entity";

export class TaskRepository {
  private readonly repository: Repository<Task>;

  constructor() {
    this.repository = AppDataSource.getRepository(Task);
  }

  findAll(): Promise<Task[]> {
    return this.repository.find({ relations: ['project', 'assignedTo'] });
  }

  findById(id: string): Promise<Task | null> {
    return this.repository.findOne({ where: { id }, relations: ['project', 'assignedTo'] });
  }

  findByUserId(userId: string): Promise<Task[]> {
    return this.repository.find({ where: { assignedTo: { id: userId } }, relations: ['project', 'assignedTo'] });
  }

  async createOne(data: Partial<Task>): Promise<Task> {
    const entity = this.repository.create(data as Task);
    return this.repository.save(entity);
  }

  async updateOne(id: string, data: Partial<Task>): Promise<Task | null> {
    await this.repository.update({ id }, data);
    return this.findById(id);
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }
}
