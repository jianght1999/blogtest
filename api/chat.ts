
import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, history, userInfo, projects, skills } = req.body;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY not configured on server.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `
      You are an AI assistant representing ${userInfo.name}, a ${userInfo.title}.
      Information about the user:
      - Bio: ${userInfo.bio}
      - Location: ${userInfo.location}
      - Projects: ${projects.map((p: any) => `${p.title}: ${p.description}`).join(', ')}
      - Key Skills: ${skills.map((s: any) => s.name).join(', ')}
      
      Guidelines:
      - Be professional, friendly, and concise.
      - If someone asks for contact info, provide ${userInfo.email}.
      - Use Markdown for formatting if necessary.
      - Language: Respond in the same language as the user.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", // 使用最新稳定的 Flash 模型
      contents: [
        ...history.map((h: any) => ({ 
          role: h.role === 'assistant' ? 'model' : 'user', 
          parts: [{ text: h.content }] 
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: 'AI Service Error', details: error.message });
  }
}
