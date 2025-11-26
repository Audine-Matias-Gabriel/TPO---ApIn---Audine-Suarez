import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    JoinColumn,
} from "typeorm";

import { Task } from "./Task.entity";

@Entity()
@Unique(["task", "order"]) // order must be unique inside a task
export class Subtask {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Task, (task) => task.subtasks, {onDelete: "CASCADE", nullable: false})
    @JoinColumn({ name: "task_id" })
    task!: Task;

    @Column({ length: 100 })
    title!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: "varchar", default: "pending" })
    status!: "pending" | "in-progress" | "completed";

    @Column({ type: "int" })
    order!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}