import { Router } from "express"; 
import { TemplateService } from "../services/template.service"; 
import { validate } from "class-validator"; 
import { plainToInstance } from "class-transformer"; 
import { CreateTemplateDTO } from "../dto/create-template.dto"; 
import { UpdateTemplateDTO } from "../dto/update-template.dto"; 
 
const router = Router(); 
const service = new TemplateService(); 
 
// TEMPORAL para desarrollo (vos después usás tu auth real) 
function userId(req) { 
  return Number(req.headers["x-user-id"] || req.user?.id); 
} 
 
router.get("/", async (req, res) => { 
  try { 
    const list = await service.list(userId(req)); 
    res.json(list); 
  } catch (e) { 
    res.status(400).json({ error: e.message }); 
  } 
}); 
 
router.get("/:id", async (req, res) => { 
  try { 
    const t = await service.detail(Number(req.params.id), userId(req)); 
    res.json(t); 
  } catch (e) { 
    res.status(404).json({ error: e.message }); 
  } 
}); 
 
router.get("/:id/prefill", async (req, res) => { 
  try { 
    const dto = await service.prefill(Number(req.params.id), userId(req)); 
    res.json(dto); 
  } catch (e) { 
    res.status(404).json({ error: e.message }); 
  } 
}); 
 
router.post("/", async (req, res) => { 
  const dto = plainToInstance(CreateTemplateDTO, req.body); 
  const errors = await validate(dto); 
  if (errors.length) return res.status(400).json(errors); 
 
  try { 
    const created = await service.create(dto, userId(req)); 
    res.status(201).json(created); 
  } catch (e) { 
    res.status(400).json({ error: e.message }); 
  } 
}); 
 
router.put("/:id", async (req, res) => { 
  const dto = plainToInstance(UpdateTemplateDTO, req.body); 
  const errors = await validate(dto); 
  if (errors.length) return res.status(400).json(errors); 
 
  try { 
    const updated = await service.update(Number(req.params.id), dto, userId(req)); 
    res.json(updated); 
  } catch (e) { 
    res.status(400).json({ error: e.message }); 
  } 
}); 
 
router.delete("/:id", async (req, res) => { 
  try { 
    await service.delete(Number(req.params.id), userId(req)); 
    res.status(204).send(); 
} catch (e) { 
res.status(400).json({ error: e.message }); 
} 
}); 
export default router; 
