
import { BlogPost } from '../types.ts';

const API_BASE_URL = (typeof process !== 'undefined' && process.env.VITE_API_BASE_URL) || '';

class DataService {
  private async safeFetch(url: string, options?: RequestInit) {
    if (!API_BASE_URL || API_BASE_URL === '/api') return null;
    try {
      const res = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async getPosts(): Promise<BlogPost[]> {
    const cloudData = await this.safeFetch('/posts');
    if (cloudData) {
      localStorage.setItem('v3_posts', JSON.stringify(cloudData));
      return cloudData;
    }
    return JSON.parse(localStorage.getItem('v3_posts') || '[]');
  }

  async savePost(post: BlogPost): Promise<void> {
    await this.safeFetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    const local = JSON.parse(localStorage.getItem('v3_posts') || '[]');
    const updated = local.some((p: any) => p.id === post.id) 
      ? local.map((p: any) => p.id === post.id ? post : p)
      : [post, ...local];
    localStorage.setItem('v3_posts', JSON.stringify(updated));
  }

  async deletePost(id: string): Promise<void> {
    await this.safeFetch(`/posts/${id}`, { method: 'DELETE' });
    const local = JSON.parse(localStorage.getItem('v3_posts') || '[]');
    localStorage.setItem('v3_posts', JSON.stringify(local.filter((p: any) => p.id !== id)));
  }

  async getConfig() {
    const cloud = await this.safeFetch('/config');
    return cloud || {
      avatarUrl: localStorage.getItem('v3_avatar') || '',
      galleryImages: JSON.parse(localStorage.getItem('v3_gallery') || '[]')
    };
  }

  async updateConfig(data: any): Promise<void> {
    await this.safeFetch('/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (data.avatarUrl) localStorage.setItem('v3_avatar', data.avatarUrl);
    if (data.galleryImages) localStorage.setItem('v3_gallery', JSON.stringify(data.galleryImages));
  }

  getGalleryImages(fallback: string[]): string[] {
    const cached = localStorage.getItem('v3_gallery');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return fallback;
  }

  async saveGalleryImages(images: string[]): Promise<void> {
    await this.updateConfig({ galleryImages: images });
  }

  async uploadImage(base64: string): Promise<string> {
    const data = await this.safeFetch('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64 })
    });
    // 如果后端成功则返回 URL，否则返回原 base64 确保能预览
    return data?.url || base64;
  }
}

export const dataService = new DataService();
