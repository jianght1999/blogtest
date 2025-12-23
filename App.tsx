
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { AIChat } from './components/AIChat.tsx';
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
  
  // Profile Image State - Nature-themed default
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem('profile_image') || 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000&auto=format&fit=crop';
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
      if (file.size > 2 * 1024 * 1024) {
        alert('文件太大，请选择 2MB 以下的图片');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这篇博客吗？')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const postData: Partial<BlogPost> = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      category: formData.get('category') as any,
      date: new Date().toISOString().split('T')[0],
      readTime: formData.get('readTime') as string || '5 min',
    };

    if (isEditing) {
      setPosts(prev => prev.map(p => p.id === isEditing.id ? { ...p, ...postData } : p));
    } else {
      const newPost: BlogPost = {
        id: Math.random().toString(36).substr(2, 9),
        ...postData as BlogPost
      };
      setPosts(prev => [newPost, ...prev]);
    }
    setShowEditModal(false);
    setIsEditing(null);
  };

  const renderContent = () => {
    if (currentSection === 'home') {
      return (
        <div className="max-w-6xl mx-auto py-12 lg:py-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Main Hero Section */}
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20 mb-32">
            <header className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-black tracking-widest uppercase mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                Creative Developer
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-slate-900 leading-[0.9] drop-shadow-sm">
                {USER_INFO.name}
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-light leading-relaxed max-w-xl border-l-4 border-indigo-500/30 pl-8 mb-12">
                {USER_INFO.bio}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-5">
                <button 
                  onClick={() => setSection('Tech')}
                  className="group px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 flex items-center"
                >
                  探索我的博客
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button className="px-10 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all">
                  联络合作
                </button>
              </div>
            </header>
            
            <div className="relative group flex-shrink-0">
              {/* Profile Image Container */}
              <div className="relative z-10 w-72 h-72 md:w-96 md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-indigo-200/50 bg-slate-100 border-[12px] border-white ring-1 ring-slate-100">
                <img 
                  src={profileImage} 
                  alt="Nature Aesthetic" 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                
                {/* Admin Overlay for Photo Change */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-slate-900 px-6 py-3 rounded-xl text-sm font-bold shadow-2xl hover:bg-indigo-50 transition-colors"
                    >
                      更换自然风照片
                    </button>
                    <p className="text-white/70 text-[10px] mt-2 font-mono uppercase tracking-widest">Supports JPG, PNG (Max 2MB)</p>
                  </div>
                )}
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*"
              />

              {/* Decorative Background Shapes */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100/50 blur-3xl rounded-full -z-10 group-hover:bg-indigo-200/60 transition-colors"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-100/50 blur-3xl rounded-full -z-10 group-hover:bg-purple-200/60 transition-colors"></div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce duration-[3000ms] hidden md:block">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Status</p>
                    <p className="text-sm font-bold text-slate-800">Available for hire</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats/About Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-slate-100">
            <div className="md:col-span-2 space-y-8">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Philosophy</h2>
              <p className="text-slate-600 leading-relaxed text-2xl font-light">
                我相信技术应当隐入背景，而<span className="text-slate-900 font-medium">用户体验</span>应当如自然景观般和谐直觉。从每一行高效的代码到每一寸像素的排列，我追求卓越的极简。
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <h3 className="text-4xl font-black text-slate-900">5+</h3>
                  <p className="text-slate-400 text-sm font-medium">Years Experience</p>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900">50+</h3>
                  <p className="text-slate-400 text-sm font-medium">Project Shipped</p>
                </div>
              </div>
            </div>
            <div className="space-y-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <span key={skill.name} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all cursor-default shadow-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      );
    }

    const filteredPosts = posts.filter(post => post.category === currentSection);
    return (
      <div className="max-w-4xl mx-auto py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSection('home')} className="text-slate-400 hover:text-indigo-600 flex items-center transition-colors group">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center mr-3 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              主页
            </button>
            <span className="text-slate-200">/</span>
            <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 border-b-4 border-indigo-500/20">{currentSection}</h2>
          </div>
          {isAdmin && (
            <button 
              onClick={() => { setIsEditing(null); setShowEditModal(true); }}
              className="text-xs bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold uppercase tracking-widest"
            >
              + 新建文章
            </button>
          )}
        </div>

        <div className="grid gap-16">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <article key={post.id} className="group pb-12 border-b border-slate-100 last:border-0 relative">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span>{post.readTime}</span>
                    {isAdmin && (
                      <div className="flex space-x-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setIsEditing(post); setShowEditModal(true); }} className="text-slate-400 hover:text-indigo-600 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(post.id)} className="text-slate-400 hover:text-red-500 transition-colors">Delete</button>
                      </div>
                    )}
                  </div>
                  <h3 className="text-4xl font-black mb-6 text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-xl text-slate-500 leading-relaxed mb-10 font-light">
                    {post.excerpt}
                  </p>
                  <button className="group w-fit text-xs font-black tracking-widest text-slate-900 border-b-2 border-slate-100 hover:border-indigo-600 transition-all pb-1 uppercase">
                    Read Article 
                    <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-slate-400 italic font-medium">暂时没有内容发布。去看看其他栏目？</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Sidebar 
        currentSection={currentSection} 
        setSection={setSection} 
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={() => setIsAdmin(false)}
      />
      
      <main className="flex-1 ml-16 p-8 md:p-12 lg:p-24 overflow-x-hidden">
        {renderContent()}
      </main>

      {/* Admin Modals remain same logic but styled to match the new 2024 nature aesthetic */}
      {showLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/10 backdrop-blur-md p-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black mb-8 flex items-center tracking-tighter">
              <span className="w-10 h-10 bg-slate-900 rounded-xl mr-4 flex items-center justify-center text-white text-lg">A</span>
              Admin Portal
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Username</label>
                <input 
                  type="text" 
                  value={loginData.username}
                  onChange={e => setLoginData({...loginData, username: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Password</label>
                <input 
                  type="password" 
                  value={loginData.password}
                  onChange={e => setLoginData({...loginData, password: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  placeholder="••••••"
                />
              </div>
              <div className="flex flex-col space-y-3 pt-6">
                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-xs">Unlock Session</button>
                <button type="button" onClick={() => setShowLogin(false)} className="w-full py-4 text-slate-400 font-bold text-xs uppercase hover:text-slate-900 transition-colors">Dismiss</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/10 backdrop-blur-md p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-[3rem] shadow-2xl p-12 w-full max-w-2xl my-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-3xl font-black mb-10 tracking-tighter">{isEditing ? 'Update Post' : 'Draft New Story'}</h2>
            <form onSubmit={handleSavePost} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Headline</label>
                <input 
                  name="title"
                  defaultValue={isEditing?.title || ''}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-xl font-bold"
                  placeholder="Give it a bold title..."
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Channel</label>
                  <select 
                    name="category"
                    defaultValue={isEditing?.category || 'Tech'}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold appearance-none"
                  >
                    <option value="Tech">技术 (Tech)</option>
                    <option value="Design">设计 (Design)</option>
                    <option value="Life">生活 (Life)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Estimated Read</label>
                  <input 
                    name="readTime"
                    defaultValue={isEditing?.readTime || '5 min'}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold"
                    placeholder="e.g. 5 min"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Brief Insight</label>
                <textarea 
                  name="excerpt"
                  defaultValue={isEditing?.excerpt || ''}
                  required
                  rows={4}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none font-light leading-relaxed"
                  placeholder="Sum up the content in a few impactful sentences..."
                />
              </div>
              <div className="flex space-x-4 pt-8 border-t border-slate-100">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs">
                  {isEditing ? 'Publish Updates' : 'Share Story'}
                </button>
                <button type="button" onClick={() => { setShowEditModal(false); setIsEditing(null); }} className="px-10 py-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all">
                  Discard
                </button>
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
