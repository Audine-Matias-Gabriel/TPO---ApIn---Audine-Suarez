import { IsString, IsOptional, IsEnum, IsArray, ArrayUnique } from "class-validator"; 
import { Priority } from "../entities/task-template.entity"; 
 
export class UpdateTemplateDTO { 
  @IsOptional() 
  @IsString() 
  name?: string; 
 
  @IsOptional() 
  @IsString() 
  description?: string; 
 
  @IsOptional() 
  @IsEnum(Priority) 
  priority?: Priority; 
 
  @IsOptional() 
  teamId?: number; 
 
  @IsOptional() 
  @IsArray() 
  @ArrayUnique() 
  tags?: number[]; 
} 
