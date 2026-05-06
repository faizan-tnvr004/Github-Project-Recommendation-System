import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // Custom id to preserve frontend URLs/saved data.
    id: { type: String, required: true, trim: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    matchScore: { type: Number, required: true },
    duration: { type: String, required: true, trim: true },
    teamSize: { type: String, required: true, trim: true },
    forks: { type: Number, required: true },
    tech: { type: [String], required: true, default: [] },
    description: { type: String, required: true, trim: true },
    highlights: { type: [String], required: true, default: [] },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

