import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { User } from "./User.entity";
import { Project } from "./Project.entity";

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    title!: string;

    @Column({ type: "varchar", nullable: true })
    description!: string | null;

    @Column({ type: "varchar", default: "pending" })
    status!: "pending" | "in-progress" | "completed" | "cancelled";

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "last_updated" })
    lastUpdated!: Date;

    @Column({ type: "timestamp", nullable: true, name: "due_date" })
    dueDate!: Date | null;

    @ManyToOne(() => User, user => user.id, { nullable: true })
    @JoinColumn({ name: "assigned_to" })
    assignedTo!: User | null;

    @ManyToOne(() => Project, project => project.id)
    @JoinColumn({ name: "project_id" })
    project!: Project;
}
