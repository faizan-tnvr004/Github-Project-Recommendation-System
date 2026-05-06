import { Router } from "express";
import { searchGithubProjects, getGithubRecommended } from "../controllers/github.controller.js";

export const githubRouter = Router();

githubRouter.get("/search", searchGithubProjects);
githubRouter.get("/recommended", getGithubRecommended);
