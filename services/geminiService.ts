import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse, AnalysisResult } from "../types";

// Helper to dynamically get the client
const getAIClient = () => {
  const userKey = localStorage.getItem('deepread_user_api_key');
  // Use user key if available, otherwise fallback to system key (if configured in env)
  const apiKey = userKey || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("未检测到有效 API Key。请点击右上角钥匙图标配置您的 Gemini API Key。");
  }

  return new GoogleGenAI({ apiKey });
};

export const analyzeContent = async (input: string, type: 'url' | 'text' = 'url'): Promise<AnalysisResponse> => {
  const ai = getAIClient();
  let prompt = "";

  if (type === 'url') {
    prompt = `
      You are an expert Content Analyst AI.
      
      Task: Analyze the content associated with this URL: ${input}

      **CRITICAL INSTRUCTION FOR URLS:**
      1. **Access & Search**: First, try to access the URL. If you cannot access it (e.g., 403 Forbidden, Login Required, Jike, WeChat), you **MUST** use the 'googleSearch' tool to search for the URL string itself, or the title/keywords of the article.
      2. **Synthesize**: Construct your analysis based on the search snippets, summaries, and available metadata. 
      3. **Force Output**: Do NOT return an error saying "I cannot access". You must provide the best possible analysis JSON based on the information found via search.

      **Language**: Output strictly in **Simplified Chinese (简体中文)**.
    `;
  } else {
    prompt = `
      You are an expert Content Analyst AI.
      Analyze the following text:
      
      """
      ${input}
      """

      **Language**: Output strictly in **Simplified Chinese (简体中文)**.
    `;
  }

  prompt += `
    **OUTPUT FORMAT**:
    Return a SINGLE, valid JSON object matching this schema exactly. 
    Do not include conversational text.
    If you include markdown code blocks, I will parse them, but raw JSON is preferred.

    {
      "title": "文章标题",
      "summary": "文章精华摘要 (3句话以内)",
      "keyInsights": ["核心洞察1", "核心洞察2", "核心洞察3", "核心洞察4"],
      "logicalFlow": [
        { "id": "1", "label": "阶段1标题", "description": "简短描述" },
        { "id": "2", "label": "阶段2标题", "description": "简短描述" }
      ],
      "counterArguments": [
        { "point": "原文观点", "rebuttal": "反方/批判性视角" }
      ],
      "similarViews": [
        { "thinker": "相关人物/流派", "perspective": "相似观点", "context": "关联背景" }
      ],
      "writingAnalysis": {
        "tone": "文章调性 (如: 理性、煽情、讽刺)",
        "audience": "目标受众",
        "structure": "写作结构 (如: SCQA, 金字塔原理, 总分总)",
        "viralFactors": ["爆款因子1", "爆款因子2"]
      }
    }
  `;

  const config: any = {};
  
  if (type === 'url') {
    config.tools = [{ googleSearch: {} }];
  } else {
    config.responseMimeType = "application/json";
  }

  try {
    // Use the experimental pro model for better reasoning
    const response = await ai.models.generateContent({
      model: "gemini-2.0-pro-exp-02-05", 
      contents: prompt,
      config: config,
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    let data: AnalysisResult;
    try {
      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
      
      const firstOpen = cleanedText.indexOf('{');
      const lastClose = cleanedText.lastIndexOf('}');
      if (firstOpen !== -1 && lastClose !== -1) {
        cleanedText = cleanedText.substring(firstOpen, lastClose + 1);
      }

      data = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON Parse Error", e);
      throw new Error("解析结果格式异常，请确保输入内容有效。");
    }

    return {
      data,
      groundingChunks: groundingChunks as any[],
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('API key') || error.message?.includes('403')) {
        throw new Error("API Key 无效或额度不足，请检查设置。");
    }
    throw error;
  }
};