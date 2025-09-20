import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";

import { User } from "./User.entity";
import { Task } from "./Task.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    body!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, user => user.id, { nullable: false })
    author!: User;

    @ManyToOne(() => Task, task => task.id, { nullable: false })
    task!: Task;
}