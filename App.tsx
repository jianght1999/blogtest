
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { AIChat } from './components/AIChat.tsx';
import { VisualGallery } from './components/VisualGallery.tsx';
import { USER_INFO } from './constants.tsx';
import { BlogPost } from './types.ts';
import { dataService } from './services/dataService.ts';

const App: React.FC = () => {
  const [currentSection, setSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [avatarUrl, setAvatarUrl] = useState(USER_INFO.avatarUrl);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);

  const contentAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const [cloudPosts, cloudConfig] = await Promise.all([
        dataService.getPosts(),
        dataService.getConfig()
      ]);
      setPosts(cloudPosts || []);
      if (cloudConfig?.avatarUrl) setAvatarUrl(cloudConfig.avatarUrl);
      setIsLoading(false);
    };
    init();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === '123456') {
      setIsAdmin(true);
      setShowLogin(false);
      localStorage.setItem('isAdmin', 'true');
    } else {
      alert('Credentials Incorrect.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && contentAreaRef.current) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const url = await dataService.uploadImage(reader.result as string);
        const textarea = contentAreaRef.current!;
        const start = textarea.selectionStart;
        const text = textarea.value;
        const markdown = `\n\n![image](${url})\n\n`;
        textarea.value = text.substring(0, start) + markdown + text.substring(textarea.selectionEnd);
      };
      reader.readAsDataURL(file);
    }
  };

  const HomeSection = () => (
    <div className="max-w-5xl mx-auto space-y-32 pb-20">
      {/* 1. Profile */}
      <section id="profile" className="pt-20 animate-fade">
        <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight mb-12 uppercase">
          {USER_INFO.name}.
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <p className="text-xl md:text-3xl font-light leading-relaxed text-slate-800">
              {USER_INFO.bio}
            </p>
          </div>
          <div className="flex flex-col justify-end">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
              Location / {USER_INFO.location}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Visual Gallery */}
      <section id="gallery" className="animate-fade" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-4">
          <span className="text-xs font-black uppercase tracking-widest">Visual Archive</span>
        </div>
        <VisualGallery isAdmin={isAdmin} />
      </section>

      {/* 3. Engineering Blueprint Index - 极简索引 */}
      <section id="blueprint" className="animate-fade" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <span className="text-xs font-black uppercase tracking-widest">System Documentation</span>
        </div>
        <a href="#notes" onClick={(e) => { e.preventDefault(); setSection('Notes'); }} className="group block border-2 border-black p-8 hover:bg-black transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-baseline space-x-4">
              <span className="text-2xl font-black uppercase tracking-tighter group-hover:text-white">Architecture & Build Docs</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500">REF: ARCH_2024</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Vite', 'TiDB', 'Gemini'].map(t => (
                <span key={t} className="text-[8px] font-black px-2 py-0.5 border border-black group-hover:border-white group-hover:text-white uppercase">{t}</span>
              ))}
              <span className="text-xl group-hover:text-white transition-transform group-hover:translate-x-2">→</span>
            </div>
          </div>
        </a>
      </section>

      {/* 4. Contact Footer - 极简布局 */}
      <footer id="contact" className="animate-fade pt-20 border-t border-slate-100" style={{ animationDelay: '0.3s' }}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">Identifier</span>
            <div className="flex flex-col space-y-1">
              <a href={`mailto:${USER_INFO.email}`} className="text-sm font-bold uppercase hover:text-slate-500 transition-colors">
                {USER_INFO.email}
              </a>
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-200">© 2024 {USER_INFO.name} — MMXXIV</span>
            </div>
          </div>
          
          <div className="flex space-x-12">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">Social Nodes</span>
              <div className="flex space-x-8">
                <a href={USER_INFO.github} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest border-b border-black/10 hover:border-black transition-all">GitHub</a>
                <a href={USER_INFO.twitter} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest border-b border-black/10 hover:border-black transition-all">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar 
        currentSection={currentSection} 
        setSection={setSection} 
        isAdmin={isAdmin} 
        avatarUrl={avatarUrl}
        onAvatarUpdate={async (u) => {
          const url = await dataService.uploadImage(u);
          setAvatarUrl(url);
          await dataService.updateConfig({ avatarUrl: url });
        }}
        onLoginClick={() => setShowLogin(true)} 
        onLogout={() => { setIsAdmin(false); localStorage.removeItem('isAdmin'); }} 
      />
      
      <main className="flex-1 ml-20 md:ml-32 p-6 md:p-20 overflow-x-hidden">
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Initializing</span>
          </div>
        ) : (
          currentSection === 'home' ? <HomeSection /> : (
            <div className="max-w-4xl mx-auto py-12 animate-fade">
              <div className="flex items-center justify-between mb-24">
                  <h2 className="text-5xl font-black uppercase tracking-tighter italic">{currentSection}</h2>
                  {isAdmin && (
                    <button onClick={() => { setIsEditing(null); setShowEditModal(true); }} className="text-[10px] font-black uppercase tracking-widest px-8 py-3 bg-black text-white">
                      + New Entry
                    </button>
                  )}
              </div>
              <div className="space-y-16">
                {posts.filter(p => p.category === currentSection).map(post => (
                  <article key={post.id} className="group cursor-pointer border-b border-slate-100 pb-12" onClick={() => setViewingPost(post)}>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-4">{post.date}</span>
                    <h3 className="text-3xl font-bold group-hover:text-slate-500 transition-colors uppercase leading-none mb-4">{post.title}</h3>
                    <p className="text-lg font-light text-slate-500 line-clamp-2">{post.content.replace(/!\[.*?\]\(.*?\)/g, '[Image]')}</p>
                  </article>
                ))}
                {posts.filter(p => p.category === currentSection).length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-200">No entries synchronized</p>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </main>

      {/* Post Viewer */}
      {viewingPost && (
        <div className="fixed inset-0 z-[1000] bg-white overflow-y-auto px-6 py-20 md:px-32">
          <div className="max-w-3xl mx-auto animate-fade">
            <button onClick={() => setViewingPost(null)} className="mb-20 text-[10px] font-black uppercase tracking-widest border border-black px-6 py-2">← Close</button>
            <h1 className="text-5xl md:text-7xl font-black mb-12 uppercase leading-tight">{viewingPost.title}</h1>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-16">{viewingPost.date} / {viewingPost.category}</div>
            
            <div className="space-y-12 pb-40">
              {viewingPost.content.split('\n').map((line, i) => {
                const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
                if (imgMatch) {
                  return (
                    <div key={i} className="my-10 group relative">
                      <img src={imgMatch[1]} alt="" className="w-full grayscale group-hover:grayscale-0 transition-all duration-700 shadow-xl border border-slate-100" />
                      <div className="absolute top-4 right-4 text-[8px] font-black bg-black text-white px-2 py-1 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Asset.Ref_{i}</div>
                    </div>
                  );
                }
                return line.trim() ? <p key={i} className="text-xl font-light leading-relaxed text-slate-800">{line}</p> : <div key={i} className="h-6" />;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Auth & Edit Modals */}
      {showLogin && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-white/90 backdrop-blur-md p-6">
          <div className="w-full max-w-xs p-10 border border-black bg-white shadow-2xl">
            <h2 className="text-[10px] font-black mb-10 uppercase tracking-widest text-center">Verification</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input type="text" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} className="w-full border-b border-black py-2 focus:outline-none font-bold text-sm" placeholder="Identifier" />
              <input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full border-b border-black py-2 focus:outline-none font-bold text-sm" placeholder="Secret Key" />
              <button type="submit" className="w-full bg-black text-white font-black py-4 uppercase text-[10px] tracking-widest">Connect</button>
              <button type="button" onClick={() => setShowLogin(false)} className="w-full text-slate-300 text-[8px] font-black uppercase mt-4">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-[2000] bg-white p-6 md:p-20 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const post = { 
                id: isEditing?.id || Date.now().toString(),
                title: f.get('title') as string,
                content: contentAreaRef.current?.value || '',
                category: f.get('category') as any,
                date: new Date().toISOString().split('T')[0],
                readTime: '8m'
              };
              await dataService.savePost(post);
              setPosts(prev => isEditing ? prev.map(x => x.id === post.id ? post : x) : [post, ...prev]);
              setShowEditModal(false);
            }} className="space-y-12">
               <input name="title" defaultValue={isEditing?.title || ''} required className="w-full text-4xl font-black focus:outline-none uppercase border-b-2 border-slate-100 pb-4" placeholder="Heading..." />
               <div className="flex items-center space-x-12">
                  <select name="category" defaultValue={isEditing?.category || 'Tech'} className="border-b border-slate-100 py-2 font-black uppercase text-[10px]">
                    {['Tech', 'Standards', 'Craft', 'Notes'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black uppercase underline decoration-2 underline-offset-4">+ Add Media</button>
               </div>
               <textarea ref={contentAreaRef} defaultValue={isEditing?.content || ''} required rows={15} className="w-full text-xl font-light focus:outline-none resize-none min-h-[400px]" placeholder="Content..." />
               <div className="flex space-x-8 pt-10">
                  <button type="submit" className="bg-black text-white font-black px-12 py-4 text-[10px] uppercase">Commit</button>
                  <button type="button" onClick={() => setShowEditModal(false)} className="text-slate-300 font-black text-[10px] uppercase">Discard</button>
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
