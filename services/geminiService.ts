import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeContent = async (input: string, type: 'url' | 'text' = 'url'): Promise<AnalysisResponse> => {
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

  // CRITICAL FIX: 
  // API throws error if 'tools' (googleSearch) and 'responseMimeType: application/json' are used together.
  // We must split the config logic.
  const config: any = {};
  
  if (type === 'url') {
    config.tools = [{ googleSearch: {} }];
    // DO NOT set responseMimeType here, or it will crash.
  } else {
    // For text mode, we don't need search, so we can enforce JSON strictly.
    config.responseMimeType = "application/json";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: config,
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    let data: AnalysisResult;
    try {
      // Robust cleaning logic is essential because URL mode cannot use responseMimeType: json
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present (common in search responses)
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
      
      // Extract JSON object if surrounded by conversational text
      const firstOpen = cleanedText.indexOf('{');
      const lastClose = cleanedText.lastIndexOf('}');
      if (firstOpen !== -1 && lastClose !== -1) {
        cleanedText = cleanedText.substring(firstOpen, lastClose + 1);
      }

      data = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON Parse Error", e);
      console.log("Raw text:", text);
      throw new Error("解析结果格式异常，建议尝试直接粘贴文本内容。");
    }

    return {
      data,
      groundingChunks: groundingChunks as any[],
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};