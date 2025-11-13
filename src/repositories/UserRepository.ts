import AppDataSource from "../db/data-source";
import { Repository, DeleteResult } from "typeorm";
import { User } from "../entities/User.entity";

export class UserRepository {
  private readonly repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }

  findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async createOne(data: Partial<User>): Promise<User> {
    const entity = this.repository.create(data as User);
    return this.repository.save(entity);
  }

  async updateOne(id: string, data: Partial<User>): Promise<User | null> {
    await this.repository.update({ id }, data);
    return this.findById(id);
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }
}
