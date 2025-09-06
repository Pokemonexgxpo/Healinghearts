import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertQuoteSchema, insertChatMessageSchema, insertFaqQuestionSchema, insertBlogPostSchema } from "@shared/schema";
import { requireAdmin } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup WebSocket server for chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const connectedClients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    connectedClients.add(ws);
    
    // Send recent chat messages to new client
    storage.getRecentChatMessages(20).then(messages => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'history', messages }));
      }
    });

    // Send current user count
    broadcastUserCount();

    ws.on('message', async (data) => {
      try {
        const messageData = JSON.parse(data.toString());
        
        if (messageData.type === 'chat_message') {
          // Basic content filtering
          const content = messageData.content?.trim();
          const username = messageData.username?.trim() || 'Anonymous';
          
          if (!content || content.length > 500) {
            return;
          }

          // Create and store message
          const newMessage = await storage.createChatMessage({
            username,
            content
          });

          // Broadcast to all connected clients
          const broadcastData = JSON.stringify({
            type: 'new_message',
            message: newMessage
          });

          connectedClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      connectedClients.delete(ws);
      broadcastUserCount();
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });

  function broadcastUserCount() {
    const userCount = connectedClients.size;
    const countData = JSON.stringify({
      type: 'user_count',
      count: userCount
    });

    connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(countData);
      }
    });
  }

  // Authentication Routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      // Simple admin password check - you can change this password
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
      
      if (password === ADMIN_PASSWORD) {
        (req.session as any).isAdmin = true;
        res.json({ message: "Logged in successfully", isAdmin: true });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    const isAdmin = req.session && (req.session as any).isAdmin;
    res.json({ isAdmin: !!isAdmin });
  });

  // API Routes
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
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

  app.get("/api/faq", async (req, res) => {
    try {
      const questions = await storage.getAllFaqQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQ questions" });
    }
  });

  app.post("/api/faq", async (req, res) => {
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

  app.get("/api/chat/messages", async (req, res) => {
    try {
      const messages = await storage.getRecentChatMessages(50);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Protected: Admin only blog creation
  app.post("/api/blog", requireAdmin, async (req, res) => {
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

  // Protected: Admin only video creation
  app.post("/api/videos", requireAdmin, async (req, res) => {
    try {
      const { title, url, description } = req.body;
      
      if (!title || !url) {
        return res.status(400).json({ message: "Title and URL are required" });
      }

      const video = await storage.createVideo({
        title,
        url,
        description: description || ""
      });
      res.status(201).json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getAllVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  return httpServer;
}
