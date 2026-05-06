import { Router } from "express";
import { usersRouter } from "./users.routes.js";
import { projectsRouter } from "./projects.routes.js";
import { authRouter } from "./auth.routes.js";
import { githubRouter } from "./github.routes.js";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.json({ ok: true, message: "API root" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/github", githubRouter);
