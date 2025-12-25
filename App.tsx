
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { AIChat } from './components/AIChat.tsx';
import { Carousel } from './components/Carousel.tsx';
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
  
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem('profile_image') || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop';
  });
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
      <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
        <header className="flex-1">
          <h1 className="text-[10vw] font-black leading-none tracking-tighter mb-10">
            {USER_INFO.name}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-20">
            <p className="text-xl text-slate-500 font-light max-w-md leading-relaxed">
              {USER_INFO.bio}
            </p>
            <div className="h-px w-20 bg-black hidden md:block"></div>
            <button 
              onClick={() => setSection('Tech')}
              className="text-xs font-black uppercase tracking-[0.3em] hover:translate-x-2 transition-transform inline-flex items-center"
            >
              Enter Workspace <span className="ml-4">→</span>
            </button>
          </div>
        </header>
      </div>

      <Carousel />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-16 py-32">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.5em]">Philosophy</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            极简不是缺失，而是克制。在复杂的数字世界中，我们通过删减无谓的噪音，去触达问题的本质。
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.5em]">Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <span key={skill.name} className="px-3 py-1.5 border border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-default">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.5em]">Presence</h2>
          <div className="flex flex-col space-y-2">
            <a href="#" className="text-sm font-light hover:underline underline-offset-4">GitHub</a>
            <a href="#" className="text-sm font-light hover:underline underline-offset-4">LinkedIn</a>
            <a href="#" className="text-sm font-light hover:underline underline-offset-4">Instagram</a>
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
