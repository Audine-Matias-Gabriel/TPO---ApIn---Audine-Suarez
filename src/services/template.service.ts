import { AppDataSource } from "../db/data-source"; 
import { TaskTemplate } from "../entities/task-template.entity"; 
import { Tag } from "../entities/tag.entity"; 
import { In } from "typeorm"; 
import { CreateTemplateDTO } from "../dto/create-template.dto"; 
import { UpdateTemplateDTO } from "../dto/update-template.dto"; 
 
export class TemplateService { 
  private repo = AppDataSource.getRepository(TaskTemplate); 
  private tagRepo = AppDataSource.getRepository(Tag); 
 
  async list(userId: number) { 
    return await this.repo.find({ 
      where: { creatorId: userId }, 
      order: { updatedAt: "DESC" }, 
    }); 
  } 
 
  async detail(id: number, userId: number) { 
    const t = await this.repo.findOne({ where: { id, creatorId: userId } }); 
    if (!t) throw new Error("Template no encontrada"); 
    return t; 
  } 
 
  async create(dto: CreateTemplateDTO, creatorId: number) { 
    const exists = await this.repo.findOne({ where: { name: dto.name, creatorId } }); 
    if (exists) throw new Error("Nombre duplicado"); 
 
    let tags = []; 
    if (dto.tags?.length) { 
      tags = await this.tagRepo.find({ where: { id: In(dto.tags) } }); 
      if (tags.length !== dto.tags.length) throw new Error("Tag inválido"); 
    } 
 
    const tpl = this.repo.create({ 
      name: dto.name, 
      description: dto.description, 
      priority: dto.priority || "MEDIUM", 
      teamId: dto.teamId || null, 
      creatorId, 
      tags, 
    }); 
 
    return await this.repo.save(tpl); 
  } 
 
  async update(id: number, dto: UpdateTemplateDTO, userId: number) { 
    const tpl = await this.repo.findOne({ where: { id, creatorId: userId } }); 
    if (!tpl) throw new Error("Template no encontrada"); 
 
    if (dto.name && dto.name !== tpl.name) { 
      const exists = await this.repo.findOne({ where: { name: dto.name, creatorId: userId } }); 
      if (exists) throw new Error("Nombre duplicado"); 
    } 
 
    if (dto.tags) { 
      const tags = await this.tagRepo.find({ where: { id: In(dto.tags) } }); 
      if (tags.length !== dto.tags.length) throw new Error("Tag inválido"); 
      tpl.tags = tags; 
    } 
 
    Object.assign(tpl, dto); 
    return await this.repo.save(tpl); 
  } 
 
  async delete(id: number, userId: number) { 
    const tpl = await this.repo.findOne({ where: { id, creatorId: userId } }); 
    if (!tpl) throw new Error("Template no encontrada"); 
 
    return await this.repo.remove(tpl); 
  } 
 
  async prefill(id: number, userId: number) { 
    const tpl = await this.repo.findOne({ where: { id, creatorId: userId } }); 
    if (!tpl) throw new Error("Template no encontrada"); 
 
    return { 
      originTemplateId: tpl.id, 
      name: tpl.name, 
      description: tpl.description, 
      priority: tpl.priority, 
      teamId: tpl.teamId, 
      tags: tpl.tags.map(t => t.id), 
    }; 
  } 
}
