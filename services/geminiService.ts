
import { GoogleGenAI } from "@google/genai";
import { USER_INFO, PROJECTS, SKILLS } from "../constants.tsx";

export class GeminiAssistant {
  async getChatResponse(message: string, history: { role: string; content: string }[]) {
    // Check if API key exists before initialization
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      console.warn("Gemini API Key is missing. Please set API_KEY in your environment variables.");
      return "系统未检测到 API Key。请在部署平台（如 Vercel）的环境变量中配置 API_KEY 后再试。";
    }

    try {
      // Create instance only when needed
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `
        You are an AI assistant representing ${USER_INFO.name}, a ${USER_INFO.title}.
        Your goal is to answer questions from visitors to Alex's personal website.
        
        Information about Alex:
        - Bio: ${USER_INFO.bio}
        - Location: ${USER_INFO.location}
        - Projects: ${PROJECTS.map(p => `${p.title}: ${p.description}`).join(', ')}
        - Key Skills: ${SKILLS.map(s => s.name).join(', ')}
        
        Guidelines:
        - Be professional, friendly, and concise.
        - If someone asks for contact info, provide ${USER_INFO.email}.
        - If someone asks something irrelevant to Alex or professional work, politely pivot back.
        - Use Markdown for formatting if necessary.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.95,
        }
      });

      return response.text || "抱歉，我暂时无法回答这个问题。";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "对话服务暂时不可用，请确保您的 API Key 有效并已开启计费（或在支持的区域内）。";
    }
  }
}

export const geminiAssistant = new GeminiAssistant();
