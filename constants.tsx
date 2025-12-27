
import { Project, Skill, BlogPost } from './types.ts';

export const USER_INFO = {
  name: "FUZZYEEE",
  title: "Fullstack Engineer & AI Explorer",
  bio: "专注于构建高性能的 Web 应用，探索 AI 与人机交互的无限可能。这里是我记录技术成长与生活随笔的数字空间。",
  email: "jianght199907@gmail.com",
  github: "https://github.com/fuzzyeee",
  linkedin: "https://linkedin.com/in/fuzzyeee",
  twitter: "https://twitter.com/fuzzyeee",
  instagram: "https://instagram.com/fuzzyeee",
  location: "Shanghai, China",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
};

export const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
];

export const BLOG_POSTS: BlogPost[] = [];

export const SKILLS: Skill[] = [
  { name: 'React / Next.js', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 92, category: 'Frontend' },
  { name: 'Node.js / Go', level: 85, category: 'Backend' },
  { name: 'Gemini / OpenAI', level: 88, category: 'AI/ML' },
  { name: 'Tailwind CSS', level: 90, category: 'Design' },
  { name: 'UI Systems', level: 85, category: 'Design' }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'AI Portfolio Engine',
    description: '一个基于 Gemini API 的智能化个人门户系统，支持动态内容生成与对话式搜索。',
    tags: ['React', 'Gemini', 'Tailwind'],
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
    link: '#'
  },
  {
    id: '2',
    title: 'Cyber Dashboard',
    description: '为数据中心设计的监控大屏，采用 Canvas 渲染高频数据流。',
    tags: ['Canvas', 'TypeScript', 'D3.js'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbda38a10ad5?q=80&w=800',
    link: '#'
  }
];
