import mongoose from "mongoose";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json({ ok: true, users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, error: "Invalid id" });
  }

  const user = await User.findById(id).lean();
  if (!user)
    return res.status(404).json({ ok: false, error: "User not found" });

  res.json({ ok: true, user });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body ?? {};

  if (!name || !email) {
    return res
      .status(400)
      .json({ ok: false, error: "name and email are required" });
  }

  const user = await User.create({ name, email });
  res.status(201).json({ ok: true, user });
});
