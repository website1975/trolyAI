import { GoogleGenAI, Type } from "@google/genai";
import { Message, PhysicsTopic, QuizQuestion } from "../types";

// Key quản lý trong LocalStorage
const STORAGE_KEY = 'gemini_api_key';

// Hàm lấy API Key: Ưu tiên từ LocalStorage, sau đó đến biến môi trường
export const getApiKey = (): string | null => {
  const storedKey = localStorage.getItem(STORAGE_KEY);
  if (storedKey) return storedKey;
  
  // Fallback sang biến môi trường (cho trường hợp chạy local có .env)
  const envKey = process.env.API_KEY;
  if (envKey && !envKey.includes("Thay_Doan_Nay") && envKey !== "AIzaSyD-5mPqRxT8Lw9NzKoJ1sV3YbA4eGfH2jK") {
    return envKey;
  }
  
  return null;
};

// Hàm lưu API Key người dùng nhập
export const saveApiKey = (key: string) => {
  localStorage.setItem(STORAGE_KEY, key.trim());
};

// Hàm helper để khởi tạo AI instance
const getAIInstance = (): GoogleGenAI => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a chat response for physics questions.
 */
export const generateChatResponse = async (
  history: Message[],
  currentMessage: string
): Promise<string> => {
  try {
    const ai = getAIInstance();
    const model = "gemini-2.5-flash";
    
    const chatHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: model,
      history: chatHistory,
      config: {
        systemInstruction: "Bạn là một giáo sư Vật lý nhiệt tình, am hiểu sâu rộng và giỏi sư phạm. Hãy giải thích các khái niệm phức tạp một cách dễ hiểu, sử dụng ví dụ thực tế. Luôn trả lời bằng tiếng Việt. Sử dụng định dạng Markdown để làm nổi bật công thức hoặc ý chính.",
      }
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "Xin lỗi, tôi không thể tạo câu trả lời lúc này.";
  } catch (error: any) {
    console.error("Chat error:", error);
    if (error.message === "MISSING_API_KEY" || error.toString().includes("API key")) {
      return "MISSING_KEY_ERROR"; 
    }
    return "Có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.";
  }
};

/**
 * Solves a physics problem from an image and/or text.
 */
export const solvePhysicsProblem = async (
  text: string,
  imageBase64?: string
): Promise<string> => {
  try {
    const ai = getAIInstance();
    const model = "gemini-2.5-flash"; 
    
    const parts: any[] = [];
    
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      });
    }

    parts.push({
      text: `Hãy giải bài tập vật lý này chi tiết từng bước. Nếu có hình ảnh, hãy phân tích hình ảnh để lấy dữ liệu. \n\nĐề bài/Câu hỏi bổ sung: ${text}`
    });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        systemInstruction: "Bạn là một trợ lý giải bài tập Vật lý chuyên nghiệp. Hãy trình bày lời giải rõ ràng, mạch lạc, có tóm tắt đề bài, công thức sử dụng và đáp án cuối cùng.",
      }
    });

    return response.text || "Không thể giải bài tập này.";
  } catch (error: any) {
    console.error("Solver error:", error);
    if (error.message === "MISSING_API_KEY" || error.toString().includes("API key")) {
      return "⚠️ LỖI: Bạn chưa nhập API Key. Vui lòng bấm vào nút Chìa khóa (🔑) ở góc trên bên phải để nhập Key.";
    }
    throw new Error("Không thể xử lý hình ảnh hoặc yêu cầu này.");
  }
};

/**
 * Generates a structured quiz based on a topic.
 */
export const generatePhysicsQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const ai = getAIInstance();
    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Tạo 5 câu hỏi trắc nghiệm về chủ đề: ${topic}. Độ khó trung bình-khá.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER, description: "Zero-based index of the correct option (0-3)" },
              explanation: { type: Type.STRING, description: "Short explanation of why the answer is correct" }
            },
            required: ["question", "options", "correctIndex", "explanation"],
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    return JSON.parse(jsonText) as QuizQuestion[];
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw error;
  }
};