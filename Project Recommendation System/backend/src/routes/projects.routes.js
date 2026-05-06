import { Router } from "express";
import {
  getProjectById,
  getProjects,
  getRecommendedProjects,
} from "../controllers/projects.controller.js";

export const projectsRouter = Router();

projectsRouter.get("/", getProjects);
projectsRouter.get("/recommended", getRecommendedProjects);
projectsRouter.get("/:id", getProjectById);

