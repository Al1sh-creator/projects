export interface Skill {
  name: string;
  description: string;
  level: number; // 0-100
  relatedProjects: string[];
}

export interface SkillCategory {
  category: string;
  color: string;
  skills: Skill[];
  colSpan?: string;
}

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: 'Database',
    color: '#007FFF', // Azure Blue
    colSpan: 'md:col-span-1',
    skills: [
      { name: 'MongoDB', description: 'NoSQL document database for scalable applications.', level: 90, relatedProjects: ['Athenify'] },
      { name: 'PostgreSQL', description: 'Advanced open-source relational database.', level: 85, relatedProjects: ['Payment Tracker'] },
      { name: 'Redis', description: 'In-memory data structure store for caching.', level: 80, relatedProjects: ['Athenify'] },
      { name: 'Firebase', description: 'Real-time database and backend-as-a-service.', level: 88, relatedProjects: ['Payment Tracker'] },
    ],
  },
  {
    category: 'Backend Architecture',
    color: '#50C878', // Emerald Green
    colSpan: 'md:col-span-2 lg:col-span-2',
    skills: [
      { name: 'Node.js', description: 'JavaScript runtime for building scalable network applications.', level: 95, relatedProjects: ['Athenify', 'The Stone Tablets'] },
      { name: 'Express', description: 'Web application framework for Node.js.', level: 92, relatedProjects: ['Athenify'] },
      { name: 'Java', description: 'Robust, object-oriented programming language.', level: 85, relatedProjects: ['Payment Tracker'] },
      { name: 'Python', description: 'Versatile language for AI and backend services.', level: 88, relatedProjects: ['Athenify'] },
      { name: 'Go', description: 'Efficient language for systems programming.', level: 75, relatedProjects: [] },
      { name: 'GraphQL', description: 'Query language for APIs.', level: 80, relatedProjects: [] },
    ],
  },
  {
    category: 'Frontend Experience',
    color: '#D4AF37', // Royal Gold
    colSpan: 'md:col-span-2 lg:col-span-2',
    skills: [
      { name: 'React', description: 'Library for building user interfaces.', level: 98, relatedProjects: ['Athenify', 'Harmonium', 'Payment Tracker'] },
      { name: 'Next.js', description: 'The React framework for production.', level: 95, relatedProjects: ['Athenify', 'The Stone Tablets'] },
      { name: 'TypeScript', description: 'JavaScript with syntax for types.', level: 92, relatedProjects: ['Athenify', 'Project Cosmos'] },
      { name: 'Tailwind CSS', description: 'Utility-first CSS framework.', level: 90, relatedProjects: ['Athenify', 'Projects Vault'] },
      { name: 'Framer Motion', description: 'Animation library for React.', level: 88, relatedProjects: ['Skills Library', 'Projects Vault'] },
      { name: 'Three.js', description: '3D library for the web.', level: 85, relatedProjects: ['Project Cosmos', 'Astral Archive'] },
    ],
  },
  {
    category: 'Tools & DevOps',
    color: '#9D4EDD', // Amethyst
    colSpan: 'md:col-span-1',
    skills: [
      { name: 'Git', description: 'Distributed version control system.', level: 95, relatedProjects: ['All'] },
      { name: 'Docker', description: 'Platform for containerizing applications.', level: 82, relatedProjects: [] },
      { name: 'AWS', description: 'Cloud computing platform.', level: 78, relatedProjects: [] },
      { name: 'Vercel', description: 'Platform for frontend frameworks.', level: 90, relatedProjects: ['Portfolio Deployment'] },
      { name: 'Figma', description: 'Interface design tool.', level: 85, relatedProjects: ['UI/UX Design'] },
    ],
  }
];
