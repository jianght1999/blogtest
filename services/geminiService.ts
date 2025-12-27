
import { USER_INFO, PROJECTS, SKILLS } from "../constants.tsx";

export class GeminiAssistant {
  async getChatResponse(message: string, history: { role: string; content: string }[]) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history,
          userInfo: USER_INFO,
          projects: PROJECTS,
          skills: SKILLS
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.includes('API_KEY')) {
          return "系统未检测到有效 API Key。请在 Vercel 环境变量中配置 API_KEY。";
        }
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.text || "抱歉，我暂时无法回答这个问题。";
    } catch (error) {
      console.error("Chat Error:", error);
      return "对话服务暂时不可用，请稍后再试或检查服务器配置。";
    }
  }
}

export const geminiAssistant = new GeminiAssistant();
