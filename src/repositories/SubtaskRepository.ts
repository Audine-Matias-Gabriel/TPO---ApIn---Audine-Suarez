import AppDataSource from "../db/data-source";
import { Repository, DeleteResult } from "typeorm";
import { Subtask } from "../entities/Subtask.entity";

export class SubtaskRepository {
    private readonly repository: Repository<Subtask>;
    constructor() {
        this.repository = AppDataSource.getRepository(Subtask);
    }

    async findAll(): Promise<Subtask[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<Subtask | null> {
        return this.repository.findOne({ where: { id } });
    }

    async createOne(data: Partial<Subtask>): Promise<Subtask> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async findLastOrderForTask(taskId: string): Promise<Subtask | null> {
        return this.repository
            .createQueryBuilder("subtask")
            .where("subtask.task_id = :taskId", { taskId })
            .orderBy("subtask.order", "DESC")
            .getOne();
    }

    async deleteOne(id: string): Promise<DeleteResult> {
        return this.repository.delete({ id });
    }
}