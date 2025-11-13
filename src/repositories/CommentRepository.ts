import AppDataSource from "../db/data-source";
import { Repository } from "typeorm";
import { Comment } from "../entities/Comment.entity";

export class CommentRepository {
  private readonly repository: Repository<Comment>;

  constructor() {
    this.repository = AppDataSource.getRepository(Comment);
  }

  findAll(): Promise<Comment[]> {
    return this.repository.find({ relations: ['author', 'task'] });
  }

  findById(id: string): Promise<Comment | null> {
    return this.repository.findOne({ where: { id }, relations: ['author', 'task'] });
  }

  async createOne(data: Partial<Comment>): Promise<Comment> {
    const entity = this.repository.create(data as Comment);
    return this.repository.save(entity);
  }

  async updateOne(id: string, data: Partial<Comment>): Promise<Comment | null> {
    await this.repository.update({ id }, data);
    return this.findById(id);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
