import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";

import { User } from "./User.entity";
import { Project } from "./Project.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    title!: string;

    @Column({ type: "varchar", nullable: true })
    description!: string | null;

    @Column({ type: "varchar", default: "pending" })
    status!: "pending" | "in-progress" | "completed" | "cancelled";

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    lastUpdated!: Date;

    @Column({ type: "timestamp", nullable: true })
    dueDate!: Date | null;

    @ManyToOne(() => User, user => user.id, { nullable: true })
    assignedTo!: User | null;

    @ManyToOne(() => Project, project => project.id)
    project!: Project;
}