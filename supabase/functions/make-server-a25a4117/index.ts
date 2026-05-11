import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono().basePath("/make-server-a25a4117");

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Get messages for a specific server
app.get("/messages/:serverId", async (c) => {
  try {
    const serverId = c.req.param("serverId");
    const messages = await kv.getByPrefix(`messages:${serverId}:`);

    // Sort by timestamp
    const sortedMessages = messages.sort((a: any, b: any) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    return c.json({ messages: sortedMessages });
  } catch (error) {
    console.log(`Error fetching messages: ${error}`);
    return c.json({ error: "Failed to fetch messages" }, 500);
  }
});

// Post a new message
app.post("/messages", async (c) => {
  try {
    const body = await c.req.json();
    const { serverId, user, content, type, image } = body;

    if (!serverId || !user || !type) {
      return c.json({ error: "Missing required fields: serverId, user, type" }, 400);
    }

    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const message = {
      id: messageId,
      serverId,
      user,
      content: content || "",
      type,
      image: image || null,
      timestamp,
    };

    await kv.set(`messages:${serverId}:${messageId}`, message);

    return c.json({ success: true, message });
  } catch (error) {
    console.log(`Error posting message: ${error}`);
    return c.json({ error: "Failed to post message" }, 500);
  }
});

// Get server calendar settings
app.get("/server-settings", async (c) => {
  try {
    const settings = await kv.get("server-calendar-settings");
    return c.json({ settings: settings || [] });
  } catch (error) {
    console.log(`Error fetching server settings: ${error}`);
    return c.json({ error: "Failed to fetch server settings" }, 500);
  }
});

// Save server calendar settings
app.post("/server-settings", async (c) => {
  try {
    const body = await c.req.json();
    const { serverId, displayType, thumbnail } = body;

    if (!serverId || !displayType) {
      return c.json({ error: "Missing required fields: serverId, displayType" }, 400);
    }

    // Get existing settings
    const existingSettings = await kv.get("server-calendar-settings") || [];

    // Update or add the setting
    const updatedSettings = Array.isArray(existingSettings) ? [...existingSettings] : [];
    const existingIndex = updatedSettings.findIndex((s: any) => s.serverId === serverId);

    const newSetting = {
      serverId,
      displayType,
      thumbnail: thumbnail || null,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      updatedSettings[existingIndex] = newSetting;
    } else {
      updatedSettings.push(newSetting);
    }

    // Save back to KV store
    await kv.set("server-calendar-settings", updatedSettings);

    return c.json({ success: true, setting: newSetting });
  } catch (error) {
    console.log(`Error saving server settings: ${error}`);
    return c.json({ error: "Failed to save server settings" }, 500);
  }
});

const buildTranscript = (messages: any[]) =>
  messages
    .filter((m) => m?.type === "text" || m?.type === "image")
    .map((m) => {
      const content = m.type === "image" ? "[image]" : (m.content || "");
      return `${m.user || "unknown"}: ${content}`;
    })
    .join("\n");

const fallbackSummary = (messages: any[]) => {
  const textMessages = messages.filter((m) => m?.type === "text");
  const imageMessages = messages.filter((m) => m?.type === "image");
  const lastQuote = textMessages.length > 0 ? textMessages[textMessages.length - 1].content || "" : "";

  return {
    mood: "대화 기록 기반 요약",
    topMoments: [
      `총 메시지 ${messages.length}개`,
      `텍스트 ${textMessages.length}개`,
      `이미지 ${imageMessages.length}개`,
    ],
    quote: lastQuote ? `"${lastQuote.slice(0, 80)}"` : "대표 문장을 찾지 못했습니다.",
    highlights: [
      "핵심 포인트를 자동 정리했습니다.",
      "대화의 흐름을 요약했습니다.",
      "이미지/텍스트 비중을 분석했습니다.",
    ],
  };
};

app.post("/ai/summary", async (c) => {
  try {
    const body = await c.req.json();
    const serverId = body?.serverId;
    const forceRefresh = body?.forceRefresh === true;
    
    if (!serverId) return c.json({ error: "Missing required field: serverId" }, 400);

    // 1. Check Cache
    const cached = await kv.get(`summary:${serverId}`);
    if (cached && !forceRefresh) {
      return c.json({ summary: cached, source: "cache" });
    }

    // 2. If no cache and not forced, do NOT generate
    if (!forceRefresh) {
      return c.json({ 
        summary: {
          mood: "요약을 생성해보세요.",
          topMoments: ["AI 요약 버튼을 눌러주세요."],
          quote: "대표 문장이 아직 없습니다.",
          highlights: ["버튼을 눌러 대화 분석을 시작하세요."]
        },
        source: "none"
      });
    }

    const messages = await kv.getByPrefix(`messages:${serverId}:`);
    const sortedMessages = messages.sort((a: any, b: any) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    if (!sortedMessages.length) {
      return c.json({ summary: fallbackSummary([]) });
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const geminiModel = "gemini-3-flash-preview";
    
    if (!geminiApiKey) {
      return c.json({ summary: fallbackSummary(sortedMessages), source: "fallback-no-key" });
    }

    const transcript = buildTranscript(sortedMessages);
    const prompt = `
다음은 채팅 기록이야. 내용을 분석해서 JSON 형식으로 요약해줘.
형식:
{
  "mood": "오늘의 전체적인 분위기 한 줄",
  "topMoments": ["가장 인상 깊었던 사건 1", "사건 2", "사건 3"],
  "quote": "가장 인상적인 문장 하나",
  "highlights": ["핵심 하이라이트 요약 1", "요약 2", "요약 3"],
  "imagePrompt": "이 채팅 분위기를 잘 나타내는 하이라이트 이미지를 생성하기 위한 상세한 영어 프롬프트"
}

채팅 기록:
${transcript}
`.trim();

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { 
            temperature: 0.7,
            response_mime_type: "application/json"
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error(`Gemini API error: ${errorData}`);
      return c.json({ summary: fallbackSummary(sortedMessages), source: "fallback-api-failed" });
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed: any = null;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
      }
    }

    const finalSummary = parsed || fallbackSummary(sortedMessages);
    
    // 2. Save to Cache
    if (parsed) {
      await kv.set(`summary:${serverId}`, parsed);
    }

    return c.json({
      summary: finalSummary,
      source: "gemini-3-flash",
    });
  } catch (error) {
    console.log(`Error generating summary: ${error}`);
    return c.json({ error: "Failed to generate summary" }, 500);
  }
});

app.post("/ai/generate-image", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, serverId, forceRefresh } = body;
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const model = "gemini-2.5-flash-image";

    if (!geminiApiKey) return c.json({ error: "Gemini API key not configured" }, 500);
    if (!prompt) return c.json({ error: "Prompt is required" }, 400);

    // 1. Check Cache
    // We use a short hash of the prompt to avoid very long keys
    const promptHash = btoa(prompt).slice(0, 32);
    const cacheKey = `image_cache:${serverId || "global"}:${promptHash}`;
    
    if (!forceRefresh) {
      const cached = await kv.get(cacheKey);
      if (cached) {
        return c.json({ imageUrl: cached, source: "cache" });
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini Image API error: ${errorText}`);
      return c.json({ error: "Failed to generate image" }, 500);
    }

    const data = await response.json();
    const imagePart = data?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    
    if (imagePart) {
      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      
      // 2. Save to Cache
      await kv.set(cacheKey, imageUrl);

      return c.json({ 
        imageUrl: imageUrl,
        source: "gemini-2.5-flash-image"
      });
    }

    return c.json({ error: "No image generated in response" }, 500);
  } catch (error) {
    console.log(`Error generating image: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/ai/meme-cards", async (c) => {
  try {
    const body = await c.req.json();
    const { serverId, summary, forceRefresh } = body;
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    if (!serverId) return c.json({ error: "Missing serverId" }, 400);

    // 1. Check Cache
    if (!forceRefresh) {
      const cached = await kv.get(`cards:${serverId}`);
      if (cached) {
        return c.json({ cards: cached, source: "cache" });
      }
    }

    if (!geminiApiKey) {
      return c.json({ 
        cards: [
          { id: "1", title: "오늘의 분위기", emoji: "✨" },
          { id: "2", title: "베스트 순간", emoji: "🎯" },
          { id: "3", title: "함께한 기록", emoji: "📸" },
        ] 
      });
    }

    // Generate card titles and prompts using Gemini 3
    const prompt = `
다음 요약 내용을 바탕으로 3개의 '밈 카드'를 만들어줘. 
각 카드는 제목과 해당 카드를 위한 이미지 생성 프롬프트를 포함해야 해.
JSON 형식으로 반환해.

요약: ${JSON.stringify(summary || {})}

형식:
{
  "cards": [
    { "id": "1", "title": "카드 제목 1", "prompt": "이미지 생성 프롬프트 1 (영어)" },
    { "id": "2", "title": "카드 제목 2", "prompt": "이미지 생성 프롬프트 2 (영어)" },
    { "id": "3", "title": "카드 제목 3", "prompt": "이미지 생성 프롬프트 3 (영어)" }
  ]
}
`.trim();

    const cardRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        }),
      }
    );

    if (!cardRes.ok) throw new Error("Failed to generate card definitions");
    const cardData = await cardRes.json();
    const rawCards = JSON.parse(cardData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    const cards = rawCards.cards || [];

    // 2. Save to Cache
    if (cards.length > 0) {
      await kv.set(`cards:${serverId}`, cards);
    }

    return c.json({ cards, source: "gemini-3-flash" });
  } catch (error) {
    console.log(`Error generating meme cards: ${error}`);
    return c.json({ error: "Failed to generate meme cards" }, 500);
  }
});


Deno.serve(app.fetch);
