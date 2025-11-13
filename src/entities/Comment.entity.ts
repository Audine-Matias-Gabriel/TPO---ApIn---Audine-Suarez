import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { User } from "./User.entity";
import { Task } from "./Task.entity";

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    body!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    @JoinColumn({ name: "author_id" })
    author!: User;

    @ManyToOne(() => Task, task => task.id, { nullable: false })
    @JoinColumn({ name: "task_id" })
    task!: Task;
}