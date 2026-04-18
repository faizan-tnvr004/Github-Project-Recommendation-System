/** Mock catalog for Project Recommendation System */

export const categories = ["All", "Web", "Data"];

export const projects = [
  {
    id: "pr-ecommerce-catalog",
    title: "E-commerce Product Catalog",
    tagline: "Modern product catalog with filtering and cart",
    category: "Web",
    level: "Intermediate",
    matchScore: 82,
    duration: "2–3 weeks",
    teamSize: "1–2",
    forks: 1243,
    tech: ["React", "TypeScript", "Tailwind CSS"],
    description:
      "Build a modern product catalog with filtering, sorting, and cart functionality. Perfect for learning state management.",
    highlights: [
      "Product filtering & sorting",
      "Cart functionality",
      "State management patterns",
    ],
  },

  {
    id: "pr-task-dashboard",
    title: "Task Management Dashboard",
    tagline: "Clean task manager with drag-and-drop",
    category: "Web",
    level: "Beginner",
    matchScore: 74,
    duration: "1–2 weeks",
    teamSize: "1",
    forks: 856,
    tech: ["React", "JavaScript", "CSS"],
    description:
      "Create a clean task manager with drag-and-drop functionality. Great introduction to React hooks and component composition.",
    highlights: [
      "Drag-and-drop tasks",
      "React hooks intro",
      "Component composition",
    ],
  },

  {
    id: "pr-realtime-chat",
    title: "Real-time Chat Application",
    tagline: "Full-stack chat with live messaging and auth",
    category: "Web",
    level: "Advanced",
    matchScore: 90,
    duration: "4–6 weeks",
    teamSize: "2–4",
    forks: 2134,
    tech: ["Node.js", "WebSocket", "MongoDB", "React"],
    description:
      "Build a full-stack chat app with real-time messaging, user authentication, and message persistence.",
    highlights: [
      "Real-time WebSocket messaging",
      "User authentication",
      "Message persistence",
    ],
  },

  {
    id: "pr-weather-app",
    title: "Weather Forecast App",
    tagline: "Fetch and display weather from external APIs",
    category: "Web",
    level: "Beginner",
    matchScore: 68,
    duration: "1 week",
    teamSize: "1",
    forks: 623,
    tech: ["JavaScript", "API Integration", "CSS"],
    description:
      "Fetch and display weather data from external APIs. Learn about async operations and data visualization.",
    highlights: [
      "External API integration",
      "Async/await patterns",
      "Data visualization basics",
    ],
  },

  {
    id: "pr-blog-cms",
    title: "Blog CMS with Markdown",
    tagline: "Content management with markdown, auth & SEO",
    category: "Web",
    level: "Intermediate",
    matchScore: 87,
    duration: "3–4 weeks",
    teamSize: "2–3",
    forks: 1567,
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    description:
      "Create a content management system with markdown support, authentication, and SEO optimization.",
    highlights: [
      "Markdown rendering",
      "Authentication system",
      "SEO optimization",
    ],
  },

  {
    id: "pr-portfolio-analytics",
    title: "Portfolio Analytics Platform",
    tagline: "Interactive analytics dashboard with real-time updates",
    category: "Data",
    level: "Advanced",
    matchScore: 92,
    duration: "5–7 weeks",
    teamSize: "3–5",
    forks: 1890,
    tech: ["React", "D3.js", "Python", "Flask"],
    description:
      "Build an analytics dashboard with interactive charts, data processing, and real-time updates.",
    highlights: [
      "Interactive D3 charts",
      "Python data processing",
      "Real-time updates",
    ],
  },
];

export function getProjectById(id) {
  return projects.find((p) => p.id === id);
}

export function getRecommended(limit = 4) {
  return [...projects]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/** Filter projects by level: 'Beginner' | 'Intermediate' | 'Advanced' */
export function getByLevel(level) {
  return projects.filter((p) => p.level === level);
}
