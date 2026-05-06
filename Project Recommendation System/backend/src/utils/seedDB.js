import { Project } from "../models/Project.js";

// Import initial mock data from the frontend catalog.
// This keeps the seed aligned with the UI's original mock dataset.
import { projects as initialProjects } from "../../../src/data/projects.mock.js";

export async function seedDB() {
  if (process.env.USE_MOCK_DATA === "true") {
    return { seeded: false, count: initialProjects.length };
  }

  const count = await Project.estimatedDocumentCount();
  if (count > 0) return { seeded: false, count };

  const inserted = await Project.insertMany(initialProjects, { ordered: true });
  return { seeded: true, count: inserted.length };
}

