import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";

import { UserProject } from "./UserProject.entity";

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    name!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @Column({ type: "varchar", nullable: true })
    description!: string | null;

    // Relations
    @OneToMany(() => UserProject, userProject => userProject.project)
    userProjects!: UserProject[];
}