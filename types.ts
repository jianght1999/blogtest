
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string; // Made optional
  content: string;
  date: string;
  category: 'Tech' | 'Notes' | 'Craft' | 'Standards';
  readTime: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'Frontend' | 'Backend' | 'Design' | 'AI/ML';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
