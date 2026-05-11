import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

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
app.get("/make-server-a25a4117/health", (c) => {
  return c.json({ status: "ok" });
});

// Get messages for a specific server
app.get("/make-server-a25a4117/messages/:serverId", async (c) => {
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
app.post("/make-server-a25a4117/messages", async (c) => {
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
app.get("/make-server-a25a4117/server-settings", async (c) => {
  try {
    const settings = await kv.get("server-calendar-settings");
    return c.json({ settings: settings || [] });
  } catch (error) {
    console.log(`Error fetching server settings: ${error}`);
    return c.json({ error: "Failed to fetch server settings" }, 500);
  }
});

// Save server calendar settings
app.post("/make-server-a25a4117/server-settings", async (c) => {
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

Deno.serve(app.fetch);