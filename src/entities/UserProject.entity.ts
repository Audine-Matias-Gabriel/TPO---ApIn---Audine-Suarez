import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { User } from "./User.entity";
import { Project } from "./Project.entity";

@Entity('users_projects')
export class UserProject {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, user => user.userProjects)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(() => Project, project => project.userProjects)
    @JoinColumn({ name: "project_id" })
    project!: Project;

    @Column({ type: "enum", enum: ["owner", "member"], default: "member" })
    role!: "owner" | "member";
}