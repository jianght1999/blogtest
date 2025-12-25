
import { Project, Skill, BlogPost } from './types.ts';

export const USER_INFO = {
  name: "ALEX CHEN",
  title: "Fullstack Engineer & Designer",
  bio: "追求代码的诗意与设计的克制。专注于构建纯粹、高效且具有永恒感的数字产品。",
  email: "alex.chen.dev@example.com",
  github: "https://github.com/alexchen",
  linkedin: "https://linkedin.com/in/alexchen",
  location: "Shanghai, China"
};

export const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187530230-b23b995163c9?q=80&w=2000&auto=format&fit=crop"
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '为什么极简主义是开发的终极形式',
    excerpt: '在代码日益复杂的今天，我们如何通过削减冗余来提高系统的健壮性？',
    date: '2024-03-20',
    category: 'Design',
    readTime: '5 min'
  },
  {
    id: '2',
    title: '深入浅出 Gemini API：构建你的第一个 AI 助手',
    excerpt: '手把手教你如何利用 Google 的最新模型为你的网页添加智能交互。',
    date: '2024-03-15',
    category: 'Tech',
    readTime: '8 min'
  },
  {
    id: '3',
    title: '数字游民的真实生活状态',
    excerpt: '离开办公室的这一年，我学到的关于自由与自律的十件事。',
    date: '2024-03-10',
    category: 'Life',
    readTime: '12 min'
  }
];

export const SKILLS: Skill[] = [
  { name: 'React', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 90, category: 'Frontend' },
  { name: 'Node.js', level: 85, category: 'Backend' },
  { name: 'Gemini AI', level: 80, category: 'AI/ML' },
  { name: 'UI/UX', level: 85, category: 'Design' }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Minimalist Portfolio',
    description: 'A personal portfolio built with React, Tailwind and Gemini API.',
    tags: ['React', 'AI'],
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    link: '#'
  }
];
