
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { AIChat } from './components/AIChat.tsx';
import { USER_INFO, BLOG_POSTS, SKILLS } from './constants.tsx';
import { BlogPost } from './types.ts';

const App: React.FC = () => {
  const [currentSection, setSection] = useState('home');
  // Future-proofing: This state will eventually be populated by your TiDB/Render API
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
    return localStorage.getItem('profile_image') || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('blog_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin.toString());
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('profile_image', profileImage);
  }, [profileImage]);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert('请上传 1.5MB 以下的图片');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const renderHome = () => (
    <div className="max-w-6xl mx-auto py-12 lg:py-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20 mb-32">
        <header className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black tracking-widest uppercase mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            Design & Code
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-slate-900 leading-[0.85] hover:tracking-tight transition-all duration-500 cursor-default">
            {USER_INFO.name}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-light leading-relaxed max-w-xl border-l-4 border-indigo-500/30 pl-8 mb-12">
            {USER_INFO.bio}
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-5">
            <button onClick={() => setSection('Tech')} className="group px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 flex items-center">
              探索作品
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button className="px-10 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold hover:border-indigo-200 transition-all">
              在线简历
            </button>
          </div>
        </header>
        
        <div className="relative group">
          <div className="relative z-10 w-72 h-72 md:w-96 md:h-[520px] rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-700 border-[12px] border-white ring-1 ring-slate-100 bg-slate-100">
            <img src={profileImage} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
            {isAdmin && (
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">更换封面</button>
              </div>
            )}
          </div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-400/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-purple-400/20 blur-[100px] rounded-full -z-10"></div>
          
          <div className="absolute top-20 -right-8 glass-panel px-6 py-4 rounded-3xl shadow-2xl float-animation hidden md:block">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-16 pt-24 border-t border-slate-100">
        <div className="md:col-span-8 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Recent Posts</h2>
            <button onClick={() => setSection('Tech')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">View All →</button>
          </div>
          <div className="grid gap-10">
            {posts.slice(0, 3).map(post => (
              <div key={post.id} className="group cursor-pointer" onClick={() => setSection(post.category)}>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{post.category}</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{post.date}</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-all mb-3 leading-tight">{post.title}</h3>
                <p className="text-slate-500 text-lg font-light line-clamp-2 leading-relaxed">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-4 space-y-12">
          <div className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl space-y-8 sticky top-32">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">My Expertise</h2>
            <div className="flex flex-wrap gap-3">
              {SKILLS.map(skill => (
                <span key={skill.name} className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white/20 transition-all cursor-default">
                  {skill.name}
                </span>
              ))}
            </div>
            <div className="pt-8 border-t border-white/10">
              <p className="text-slate-400 text-xs leading-relaxed italic font-light">
                "致力于在复杂的逻辑中寻找简洁的表达方式。"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent flex text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Sidebar currentSection={currentSection} setSection={setSection} isAdmin={isAdmin} onLoginClick={() => setShowLogin(true)} onLogout={() => setIsAdmin(false)} />
      <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
      <main className="flex-1 ml-16 p-8 md:p-12 lg:p-24 overflow-x-hidden">
        {currentSection === 'home' ? renderHome() : (
          <div className="max-w-4xl mx-auto py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between mb-16">
              <div className="flex items-center space-x-4">
                <button onClick={() => setSection('home')} className="text-slate-400 hover:text-indigo-600 flex items-center transition-colors group">
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center mr-4 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </div>
                  <span className="font-bold">主页</span>
                </button>
                <span className="text-slate-200">/</span>
                <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 border-b-4 border-indigo-500/10">{currentSection}</h2>
              </div>
              {isAdmin && (
                <button onClick={() => { setIsEditing(null); setShowEditModal(true); }} className="text-xs bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-black uppercase tracking-widest">
                  + 撰写文章
                </button>
              )}
            </div>
            <div className="grid gap-20">
              {posts.filter(p => p.category === currentSection).map(post => (
                <article key={post.id} className="group relative">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-3 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">{post.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span>{post.date}</span>
                      {isAdmin && (
                        <div className="flex space-x-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setIsEditing(post); setShowEditModal(true); }} className="text-slate-400 hover:text-indigo-600 transition-colors">编辑</button>
                          <button onClick={() => { if(window.confirm('确定?')) setPosts(p => p.filter(x => x.id !== post.id)) }} className="text-slate-400 hover:text-red-500 transition-colors">删除</button>
                        </div>
                      )}
                    </div>
                    <h3 className="text-4xl font-black mb-6 text-slate-900 group-hover:text-indigo-600 transition-all leading-tight">{post.title}</h3>
                    <p className="text-xl text-slate-500 leading-relaxed mb-10 font-light">{post.excerpt}</p>
                    <button className="group w-fit text-[10px] font-black tracking-[0.2em] text-slate-900 border-b-2 border-slate-100 hover:border-indigo-600 transition-all pb-1 uppercase">
                      继续阅读 <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/10 backdrop-blur-xl p-6">
          <div className="bg-white/90 border border-white rounded-[2.5rem] shadow-2xl p-12 w-full max-w-md animate-in zoom-in-95">
            <h2 className="text-3xl font-black mb-8 flex items-center tracking-tighter">
              <span className="w-10 h-10 bg-slate-900 rounded-xl mr-4 flex items-center justify-center text-white text-lg font-mono">A</span>
              Console
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input type="text" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold" placeholder="admin" />
              <input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition-all font-bold" placeholder="••••••" />
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl uppercase tracking-widest text-xs">Authorize</button>
              <button type="button" onClick={() => setShowLogin(false)} className="w-full py-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Dismiss</button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/10 backdrop-blur-xl p-6 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl p-12 w-full max-w-2xl my-auto animate-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black mb-10 tracking-tighter">Draft</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const data = { title: f.get('title') as string, excerpt: f.get('excerpt') as string, category: f.get('category') as any, date: new Date().toISOString().split('T')[0], readTime: '5 min' };
              if (isEditing) setPosts(p => p.map(x => x.id === isEditing.id ? { ...x, ...data } : x));
              else setPosts(p => [{ id: Date.now().toString(), ...data }, ...p]);
              setShowEditModal(false);
            }} className="space-y-8">
              <input name="title" defaultValue={isEditing?.title || ''} required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-xl font-bold" placeholder="Headline..." />
              <select name="category" defaultValue={isEditing?.category || 'Tech'} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold">
                <option value="Tech">Tech</option><option value="Design">Design</option><option value="Life">Life</option>
              </select>
              <textarea name="excerpt" defaultValue={isEditing?.excerpt || ''} required rows={4} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all resize-none font-light leading-relaxed" placeholder="Short description..." />
              <div className="flex space-x-4 pt-8">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs">Publish</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="px-10 py-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase text-slate-400">Cancel</button>
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
