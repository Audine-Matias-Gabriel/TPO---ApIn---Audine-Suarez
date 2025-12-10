import { IsString, IsOptional, IsEnum, IsArray, ArrayUnique, MaxLength } from "class-validator"; 
import { Priority } from "../entities/task-template.entity"; 
 
export class CreateTemplateDTO { 
  @IsString() 
  @MaxLength(150) 
  name: string; 
 
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
