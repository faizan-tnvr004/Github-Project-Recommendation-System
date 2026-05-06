import { Router } from "express";
import {
  createUser,
  getUserById,
  listUsers,
} from "../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.get("/", listUsers);
usersRouter.get("/:id", getUserById);
usersRouter.post("/", createUser);

