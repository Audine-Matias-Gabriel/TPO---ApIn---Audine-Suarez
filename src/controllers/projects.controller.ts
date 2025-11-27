import { Request, Response } from "express";
import { projectsService } from "../services/projects.service";
import { usersProjectsService } from "../services/usersprojects.service";
import { validateProjectCreation, validateProjectUpdate } from "../validators/projects.validator";

export async function createProjectController(req: Request, res: Response) {
    const errors = validateProjectCreation(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    try {
        const project = await projectsService.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: "Error creating project" });
    }
}

export async function updateProjectController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Project id is required" });
    }
    const errors = validateProjectUpdate(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    const project = await projectsService.findById(id);
    if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    const updatedProject = await projectsService.update(id, req.body);
    res.json(updatedProject);
}

export async function getAllProjectsController(req: Request, res: Response) {
    const projects = await projectsService.findAll();
    res.json(projects);
}

export async function getProjectsByUserController(req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: "User id is required" });
    }
    const allProjects = await projectsService.findAll();
    const allUserProjects = await usersProjectsService.findAll();
    //const userProjects = ;
    res.json();
}

export async function getProjectByIdController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Project id is required" });
    }
    const project = await projectsService.findById(id);
    if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.json(project);
}

export async function deleteProjectController(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Project id is required" });
    }
    const project = await projectsService.findById(id);
    if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    await projectsService.delete(id);
    res.json({ message: "Proyecto eliminado" });
}