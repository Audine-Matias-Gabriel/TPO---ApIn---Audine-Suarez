mport { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToMany, 
  JoinTable, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Unique, 
} from "typeorm"; 
import { Tag } from "./tag.entity"; 
import { User } from "./user.entity"; 
import { Team } from "./team.entity"; 
 
export enum Priority { 
  HIGH = "HIGH", 
  MEDIUM = "MEDIUM", 
  LOW = "LOW", 
} 
 
@Entity("task_templates") 
@Unique(["name", "creatorId"]) 
export class TaskTemplate { 
  @PrimaryGeneratedColumn() 
  id: number; 
 
  @Column() 
  name: string; 
 
  @Column({ type: "text", nullable: true }) 
  description?: string; 
 
  @Column({ type: "enum", enum: Priority, default: Priority.MEDIUM }) 
  priority: Priority; 
 
  @Column({ nullable: true }) 
  teamId?: number; 
 
  @ManyToOne(() => Team, { nullable: true, onDelete: "SET NULL" }) 
  team?: Team; 
 
  @Column() 
  creatorId: number; 
 
  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" }) 
  creator: User; 
 
  @ManyToMany(() => Tag, { eager: true }) 
  @JoinTable({ 
    name: "task_template_tags", 
    joinColumn: { name: "templateId" }, 
    inverseJoinColumn: { name: "tagId" }, 
  }) 
  tags: Tag[]; 
 
  @CreateDateColumn() 
  createdAt: Date; 
 
  @UpdateDateColumn() 
  updatedAt: Date; 
} 
