import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";

import { UserProject } from "./UserProject.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    // Relations
    @OneToMany(() => UserProject, userProject => userProject.user)
    userProjects!: UserProject[];
}