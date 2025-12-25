
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { AIChat } from './components/AIChat.tsx';
import { VisualGallery } from './components/VisualGallery.tsx';
import { USER_INFO, BLOG_POSTS, SKILLS } from './constants.tsx';
import { BlogPost } from './types.ts';

const App: React.FC = () => {
  const [currentSection, setSection] = useState('home');
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('blog_posts');
    return saved ? JSON.parse(saved) : BLOG_POSTS;
  });
  
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isEditing, setIsEditing] = useState<BlogPost | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('blog_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin.toString());
  }, [isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === '123456') {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginData({ username: '', password: '' });
    } else {
      alert('凭证错误');
    }
  };

  const renderHome = () => (
    <div className="max-w-7xl mx-auto py-12 animate-fade">
      {/* Hero Section */}
      <div className="flex flex-col gap-12 mb-32">
        <header className="w-full">
          <h1 className="text-[12vw] font-black leading-[0.8] tracking-tighter mb-16 select-none">
            {USER_INFO.name}
          </h1>
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-32">
            <div className="flex-1">
              <p className="text-2xl md:text-3xl text-black font-light leading-snug max-w-2xl">
                {USER_INFO.bio}
              </p>
            </div>
            <div className="md:w-1/3 space-y-8 pt-2">
              <div className="h-px w-full bg-black/10"></div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Current Focus</p>
              <p className="text-sm font-medium leading-relaxed">
                正在研究生成式 AI 如何重塑现代 Web 交互的边界，并致力于构建更具人性化的自动化工具。
              </p>
              <button 
                onClick={() => setSection('Tech')}
                className="group text-xs font-black uppercase tracking-[0.3em] inline-flex items-center pt-4"
              >
                Explore My Work <span className="ml-4 group-hover:translate-x-2 transition-transform">→</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      <VisualGallery />

      {/* Info Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 py-40 border-b border-slate-100">
        {/* Replaced Philosophy with Build Document */}
        <div 
          className="space-y-10 group cursor-pointer" 
          onClick={() => setSection('Tech')}
        >
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-300">Build Document</h2>
          <div className="space-y-6">
            <p className="text-2xl font-light leading-relaxed group-hover:translate-x-2 transition-transform duration-500">
              探索本站的构建逻辑与技术栈实现。从底层架构到 Vercel 自动化部署的全流程记录，这也是一篇记录成长的博客。
            </p>
            <div className="text-[10px] font-black uppercase tracking-widest border-b border-black inline-block pb-1">
              Read Document ↗
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-300">Expertise</h2>
          <div className="grid grid-cols-1 gap-12">
            <div>
              <p className="text-sm font-black mb-4 uppercase tracking-widest">Core Capabilities</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <span key={skill.name} className="px-4 py-2 border border-slate-100 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-default">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-black mb-4 uppercase tracking-widest">Industry Experience</p>
              <ul className="text-sm space-y-3 font-light text-slate-500">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  金融科技平台交互重构
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  基于 Gemini 的智能内容分发引擎
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  企业级极简设计系统库
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Connection Section / Footer */}
      <section className="py-40">
        <div className="flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="max-w-xl">
            <h2 className="text-[6vw] md:text-[4vw] font-black leading-none tracking-tighter mb-8 uppercase">
              Let's create <br/>Something Iconic.
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed mb-10">
              我有兴趣参与具有挑战性的项目，尤其是那些试图通过设计和技术改善人们生活的尝试。
            </p>
            <a href={`mailto:${USER_INFO.email}`} className="text-xl md:text-2xl font-black border-b-2 border-black pb-2 hover:text-slate-500 hover:border-slate-300 transition-all">
              {USER_INFO.email}
            </a>
          </div>

          <div className="w-full md:w-auto">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-300 mb-10">Social Presence</h3>
            <div className="flex flex-col gap-6">
              {[
                { name: 'GitHub', url: USER_INFO.github },
                { name: 'LinkedIn', url: USER_INFO.linkedin },
                { name: 'Twitter', url: USER_INFO.twitter },
                { name: 'Instagram', url: USER_INFO.instagram },
              ].map(social => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between min-w-[200px] border-b border-slate-100 pb-4 hover:border-black transition-colors"
                >
                  <span className="text-sm font-bold uppercase tracking-widest">{social.name}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-40 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          <p>© 2024 {USER_INFO.name}. Built with Precision.</p>
          <div className="flex items-center gap-8">
            <span className="text-black">Location: {USER_INFO.location}</span>
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-black">Back to Top ↑</button>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex text-black selection:bg-black selection:text-white">
      <Sidebar 
        currentSection={currentSection} 
        setSection={setSection} 
        isAdmin={isAdmin} 
        onLoginClick={() => setShowLogin(true)} 
        onLogout={() => setIsAdmin(false)} 
      />
      
      <main className="flex-1 ml-20 p-8 md:p-12 lg:p-20 overflow-x-hidden">
        {currentSection === 'home' ? renderHome() : (
          <div className="max-w-4xl mx-auto py-12 animate-fade">
             <div className="flex items-center justify-between mb-24">
                <h2 className="text-5xl font-black uppercase tracking-tighter">{currentSection}</h2>
                {isAdmin && (
                  <button onClick={() => { setIsEditing(null); setShowEditModal(true); }} className="text-[10px] font-black uppercase tracking-widest px-8 py-3 bg-black text-white hover:bg-slate-800 transition-colors">
                    + New Post
                  </button>
                )}
             </div>
             <div className="grid gap-24">
              {posts.filter(p => p.category === currentSection).map(post => (
                <article key={post.id} className="group border-b border-slate-100 pb-20">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-4 mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                      <span>{post.date}</span>
                      <span>/</span>
                      <span className="text-black">{post.readTime}</span>
                      {isAdmin && (
                        <div className="flex space-x-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setIsEditing(post); setShowEditModal(true); }} className="text-slate-400 hover:text-black">Edit</button>
                          <button onClick={() => setPosts(p => p.filter(x => x.id !== post.id))} className="text-slate-400 hover:text-red-600">Delete</button>
                        </div>
                      )}
                    </div>
                    <h3 className="text-3xl font-black mb-6 hover:translate-x-2 transition-transform cursor-pointer leading-tight">{post.title}</h3>
                    <p className="text-lg text-slate-400 leading-relaxed font-light">{post.excerpt}</p>
                  </div>
                </article>
              ))}
              {posts.filter(p => p.category === currentSection).length === 0 && (
                <p className="text-slate-300 italic tracking-widest text-center py-40 uppercase text-xs">Waiting for new ideas...</p>
              )}
             </div>
          </div>
        )}
      </main>

      {/* Simplified Admin Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6">
          <div className="w-full max-w-sm p-12 border border-black animate-fade">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter">Access Key</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input type="text" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} className="w-full border-b border-black py-4 focus:outline-none placeholder:text-slate-300 font-bold" placeholder="Username" />
              <input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full border-b border-black py-4 focus:outline-none placeholder:text-slate-300 font-bold" placeholder="Password" />
              <button type="submit" className="w-full bg-black text-white font-black py-4 hover:bg-slate-800 transition-all uppercase text-xs tracking-widest">Authorize</button>
              <button type="button" onClick={() => setShowLogin(false)} className="w-full py-2 text-slate-300 font-black uppercase tracking-widest text-[10px] mt-4">Close</button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white p-6 md:p-20 overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto animate-fade">
            <h2 className="text-5xl font-black mb-20 uppercase tracking-tighter">{isEditing ? 'Edit' : 'New'} Draft</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const data = { title: f.get('title') as string, excerpt: f.get('excerpt') as string, category: f.get('category') as any, date: new Date().toISOString().split('T')[0], readTime: '5 min' };
              if (isEditing) setPosts(p => p.map(x => x.id === isEditing.id ? { ...x, ...data } : x));
              else setPosts(p => [{ id: Date.now().toString(), ...data }, ...p]);
              setShowEditModal(false);
            }} className="space-y-12">
              <input name="title" defaultValue={isEditing?.title || ''} required className="w-full text-4xl font-black border-b border-slate-100 py-6 focus:outline-none placeholder:text-slate-100" placeholder="Post Title" />
              <div className="grid grid-cols-2 gap-10">
                <select name="category" defaultValue={isEditing?.category || 'Tech'} className="border-b border-slate-100 py-4 focus:outline-none font-bold">
                  <option value="Tech">Tech</option><option value="Design">Design</option><option value="Life">Life</option>
                </select>
              </div>
              <textarea name="excerpt" defaultValue={isEditing?.excerpt || ''} required rows={6} className="w-full text-xl font-light border-b border-slate-100 py-6 focus:outline-none resize-none placeholder:text-slate-100" placeholder="Write your thoughts here..." />
              <div className="flex space-x-12 pt-10">
                <button type="submit" className="bg-black text-white font-black px-12 py-5 uppercase text-xs tracking-widest hover:bg-slate-800 transition-colors">Save Content</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="font-black uppercase text-xs tracking-widest text-slate-300 hover:text-black transition-colors">Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIChat />
    </div>
  );
};

export default App;
