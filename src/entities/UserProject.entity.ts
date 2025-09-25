import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";

import { User } from "./User.entity";
import { Project } from "./Project.entity";

@Entity()
export class UserProject {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, user => user.userProjects)
    user!: User;

    @ManyToOne(() => Project, project => project.userProjects)
    project!: Project;

    @Column({ type: "enum", enum: ["owner", "member"], default: "member" })
    role!: "owner" | "member";
}