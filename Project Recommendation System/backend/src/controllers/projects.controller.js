import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/Project.js";
import { projects as mockProjects } from "../../../src/data/projects.mock.js";

function sortByMatchScoreDesc(items) {
  return [...items].sort((a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0));
}

export const getProjects = asyncHandler(async (req, res) => {
  const category = String(req.query?.category || "").trim();

  if (process.env.USE_MOCK_DATA === "true") {
    const filtered =
      category && category !== "All"
        ? mockProjects.filter((p) => p.category === category)
        : mockProjects;
    return res.json({ ok: true, projects: sortByMatchScoreDesc(filtered) });
  }

  const filter = category && category !== "All" ? { category } : {};

  const projects = await Project.find(filter).sort({ matchScore: -1 }).lean();
  res.json({ ok: true, projects });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (process.env.USE_MOCK_DATA === "true") {
    const project = mockProjects.find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ ok: false, error: "Project not found" });
    }
    return res.json({ ok: true, project });
  }

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

  if (process.env.USE_MOCK_DATA === "true") {
    return res.json({ ok: true, projects: sortByMatchScoreDesc(mockProjects).slice(0, limit) });
  }

  const projects = await Project.find({}).sort({ matchScore: -1 }).limit(limit).lean();

  res.json({ ok: true, projects });
});

