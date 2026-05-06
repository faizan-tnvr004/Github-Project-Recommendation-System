import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/Project.js";

export const getProjects = asyncHandler(async (req, res) => {
  const category = String(req.query?.category || "").trim();

  const filter =
    category && category !== "All" ? { category } : {};

  const projects = await Project.find(filter).sort({ matchScore: -1 }).lean();
  res.json({ ok: true, projects });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findOne({ id }).lean();

  if (!project) {
    return res.status(404).json({ ok: false, error: "Project not found" });
  }

  res.json({ ok: true, project });
});

export const getRecommendedProjects = asyncHandler(async (req, res) => {
  const limitRaw = req.query?.limit;
  const limit =
    limitRaw === undefined || limitRaw === null || limitRaw === ""
      ? 4
      : Math.max(1, Math.min(100, Number(limitRaw) || 4));

  const projects = await Project.find({})
    .sort({ matchScore: -1 })
    .limit(limit)
    .lean();

  res.json({ ok: true, projects });
});

