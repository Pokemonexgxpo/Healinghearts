// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  quotes;
  chatMessages;
  faqQuestions;
  blogPosts;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.quotes = /* @__PURE__ */ new Map();
    this.chatMessages = /* @__PURE__ */ new Map();
    this.faqQuestions = /* @__PURE__ */ new Map();
    this.blogPosts = /* @__PURE__ */ new Map();
    this.initializeDefaultData();
  }
  initializeDefaultData() {
    const defaultQuotes = [
      { content: "It's ok to not be ok", author: "Unknown" },
      { content: "Be kind for everyone you meet is fighting a battle", author: "Unknown" },
      { content: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Unknown" },
      { content: "Healing isn't linear. Some days will be harder than others.", author: "Unknown" },
      { content: "You are stronger than you think and more resilient than you feel.", author: "Unknown" },
      { content: "Progress, not perfection.", author: "Unknown" }
    ];
    defaultQuotes.forEach((quote) => {
      const id = randomUUID();
      this.quotes.set(id, {
        id,
        content: quote.content,
        author: quote.author,
        createdAt: /* @__PURE__ */ new Date()
      });
    });
    const defaultFaqs = [
      {
        question: "I'm stressed, what do I do?",
        answer: "Take deep breaths or simply take a walk outside. Sometimes squeezing and playing with a fidget can help too. You could also try making homemade crafts or family-friendly activities to help relax your mind."
      },
      {
        question: "I feel like I'm a burden on my friends and family. Am I?",
        answer: "I'm sorry that you feel this way but you're really not. Some steps you could take to feel better is maybe talk to your family about how you feel. Every human is worth something or why else would they be created. It's normal to feel this way and unfortunately many people feel this way. Consider going into the chat room and talk this out with people that go through similar issues or you could try talking it out. Everyone in this world is worth something. If you need to talk send me a dm at Reachanya@09.gmail.com"
      },
      {
        question: "If I go to therapy, is something wrong with me?",
        answer: "No, going to therapy should be considered a normal thing and many people go through it. It helps you process your emotions and talk out what you go through. Anyone who says different is wrong!! If therapy isn't working for you try an alternate therapist or journal your feelings."
      },
      {
        question: "If I have self harm thoughts, does that make me a bad person?",
        answer: `No, not at all. Sometimes the world can be a hard place to navigate and unfortunately sometimes people self harm as a way to "cope" but it isn't. It just makes things worse. Take a deep breath and you got this! Try doing other things to take your mind off of it, like taking a walk or biking, or even doing chores! Need anything, send a text at my email: Reachanya@09.gmail.com`
      },
      {
        question: "How do I know if I need to talk to someone?",
        answer: "If your thoughts are interfering with your work or being happy, or you have the strong urge to self harm, then you should really talk to someone like a friend or parent. There are suicide crisis lifelines that you can talk to: a famous one being 988 and please feel free to shoot me an email: Reachanya@09.gmail.com"
      },
      {
        question: "I'm gay/bisexual or trans, am I less of a person? What if my family doesn't support me?",
        answer: `Being gay or trans or anything does NOT mean you are less of a person. It just means you might identify differently than what "normal" people do and that's ok. Many people fall under this category. If your family doesn't support you, maybe they have different ideals and beliefs but that doesn't make it ok. I'm sorry that you go through that, consider talking to them about it.`
      },
      {
        question: "Does being neurodivergent make me incapable of finding love?",
        answer: "Being different does not limit your capacity for love. Many neurodivergent people still can and do find love."
      },
      {
        question: "What if I never find anyone to love?",
        answer: "The right person could take time to find and comes at the right time. If you are not finding anyone, you could use this time to focus on your career and other things. Not having a partner does NOT mean that you can't still feel happy. There are many single happy people there. If you really want to find love, love yourself first and you can find it in your family and friends and the simple things you do! Don't force or pressure yourself to find love."
      },
      {
        question: "What does being neurodivergent mean?",
        answer: `Someone's brain which works in a fascinating and unique way not considered to be "normal" but the secret is, everyone in this world is a little neurodivergent in their own way.`
      },
      {
        question: "I feel underconfident in my body, I'm too fat/skinny?",
        answer: "Everyone's body is different and you don't always have to compare yourself to everyone you see in school, work or social media where most people compare themselves. Everyone is beautiful in their own way."
      }
    ];
    defaultFaqs.forEach((faq) => {
      const id = randomUUID();
      this.faqQuestions.set(id, {
        id,
        question: faq.question,
        answer: faq.answer,
        createdAt: /* @__PURE__ */ new Date()
      });
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getAllQuotes() {
    return Array.from(this.quotes.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async createQuote(insertQuote) {
    const id = randomUUID();
    const quote = {
      ...insertQuote,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      author: insertQuote.author || "Unknown"
    };
    this.quotes.set(id, quote);
    return quote;
  }
  async getRecentChatMessages(limit = 50) {
    return Array.from(this.chatMessages.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit).reverse();
  }
  async createChatMessage(insertMessage) {
    const id = randomUUID();
    const message = {
      ...insertMessage,
      id,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }
  async getAllFaqQuestions() {
    return Array.from(this.faqQuestions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async createFaqQuestion(insertQuestion) {
    const id = randomUUID();
    const question = {
      ...insertQuestion,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.faqQuestions.set(id, question);
    return question;
  }
  async getAllBlogPosts() {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async createBlogPost(insertPost) {
    const id = randomUUID();
    const post = {
      ...insertPost,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      author: insertPost.author || "Anonymous"
    };
    this.blogPosts.set(id, post);
    return post;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  author: text("author").default("Unknown"),
  createdAt: timestamp("created_at").defaultNow()
});
var chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});
var faqQuestions = pgTable("faq_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").default("Anonymous"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true
});
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true
});
var insertFaqQuestionSchema = createInsertSchema(faqQuestions).omit({
  id: true,
  createdAt: true
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/routes.ts
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const connectedClients = /* @__PURE__ */ new Set();
  wss.on("connection", (ws) => {
    connectedClients.add(ws);
    storage.getRecentChatMessages(20).then((messages) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "history", messages }));
      }
    });
    broadcastUserCount();
    ws.on("message", async (data) => {
      try {
        const messageData = JSON.parse(data.toString());
        if (messageData.type === "chat_message") {
          const content = messageData.content?.trim();
          const username = messageData.username?.trim() || "Anonymous";
          if (!content || content.length > 500) {
            return;
          }
          const newMessage = await storage.createChatMessage({
            username,
            content
          });
          const broadcastData = JSON.stringify({
            type: "new_message",
            message: newMessage
          });
          connectedClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws.on("close", () => {
      connectedClients.delete(ws);
      broadcastUserCount();
    });
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      connectedClients.delete(ws);
    });
  });
  function broadcastUserCount() {
    const userCount = connectedClients.size;
    const countData = JSON.stringify({
      type: "user_count",
      count: userCount
    });
    connectedClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(countData);
      }
    });
  }
  app2.get("/api/quotes", async (req, res) => {
    try {
      const quotes2 = await storage.getAllQuotes();
      res.json(quotes2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });
  app2.post("/api/quotes", async (req, res) => {
    try {
      const result = insertQuoteSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid quote data", errors: result.error.errors });
      }
      const quote = await storage.createQuote(result.data);
      res.status(201).json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to create quote" });
    }
  });
  app2.get("/api/faq", async (req, res) => {
    try {
      const questions = await storage.getAllFaqQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQ questions" });
    }
  });
  app2.post("/api/faq", async (req, res) => {
    try {
      const result = insertFaqQuestionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid question data", errors: result.error.errors });
      }
      const question = await storage.createFaqQuestion({
        question: result.data.question,
        answer: "Thank you for your question! We'll review it and provide an answer soon."
      });
      res.status(201).json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit question" });
    }
  });
  app2.get("/api/chat/messages", async (req, res) => {
    try {
      const messages = await storage.getRecentChatMessages(50);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });
  app2.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.post("/api/blog", async (req, res) => {
    try {
      const result = insertBlogPostSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid blog post data", errors: result.error.errors });
      }
      const post = await storage.createBlogPost(result.data);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
