import express from "express";
import session from "express-session";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple in-memory storage for production
class MemStorage {
  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.chatMessages = new Map();
    this.faqQuestions = new Map();
    this.blogPosts = new Map();
    this.videos = new Map();
    
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Default quotes
    const defaultQuotes = [
      { content: "It's ok to not be ok", author: "Unknown" },
      { content: "Be kind for everyone you meet is fighting a battle", author: "Unknown" },
      { content: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Unknown" },
    ];

    defaultQuotes.forEach(quote => {
      const id = Math.random().toString(36).substr(2, 9);
      this.quotes.set(id, {
        id,
        content: quote.content,
        author: quote.author,
        approved: true, // Default quotes are pre-approved
        createdAt: new Date(),
      });
    });

    // Default FAQ questions
    const defaultFaqs = [
      {
        question: "I'm stressed, what do I do?",
        answer: "Take deep breaths or simply take a walk outside. Sometimes squeezing and playing with a fidget can help too."
      },
      {
        question: "I feel like I'm a burden on my friends and family. Am I?",
        answer: "You're really not a burden. Every human is worth something. Consider talking to someone you trust about how you feel."
      }
    ];

    defaultFaqs.forEach(faq => {
      const id = Math.random().toString(36).substr(2, 9);
      this.faqQuestions.set(id, {
        id,
        question: faq.question,
        answer: faq.answer,
        createdAt: new Date(),
      });
    });
  }

  async getApprovedQuotes() {
    return Array.from(this.quotes.values())
      .filter(quote => quote.approved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllQuotes() {
    return Array.from(this.quotes.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPendingQuotes() {
    return Array.from(this.quotes.values())
      .filter(quote => !quote.approved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createQuote(quote) {
    const id = Math.random().toString(36).substr(2, 9);
    const newQuote = { 
      ...quote, 
      id, 
      createdAt: new Date(),
      author: quote.author || "Unknown",
      approved: false // New quotes require approval
    };
    this.quotes.set(id, newQuote);
    return newQuote;
  }

  async approveQuote(id) {
    const quote = this.quotes.get(id);
    if (quote) {
      quote.approved = true;
      this.quotes.set(id, quote);
      return quote;
    }
    return undefined;
  }

  async getAllFaqQuestions() {
    return Array.from(this.faqQuestions.values());
  }

  async getAllBlogPosts() {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createBlogPost(post) {
    const id = Math.random().toString(36).substr(2, 9);
    const newPost = { 
      ...post, 
      id, 
      createdAt: new Date(),
      author: post.author || "Anonymous"
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async getAllVideos() {
    return Array.from(this.videos.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createVideo(video) {
    const id = Math.random().toString(36).substr(2, 9);
    const newVideo = { 
      ...video, 
      id, 
      createdAt: new Date(),
      description: video.description || ""
    };
    this.videos.set(id, newVideo);
    return newVideo;
  }

  async getRecentChatMessages(limit = 50) {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
      .reverse();
  }

  async createChatMessage(message) {
    const id = Math.random().toString(36).substr(2, 9);
    const newMessage = { 
      ...message, 
      id, 
      timestamp: new Date() 
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
}

const storage = new MemStorage();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'healing-hearts-admin-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Admin authentication middleware
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Admin access required" });
  }
}

const httpServer = createServer(app);

// WebSocket setup
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
const connectedClients = new Set();

wss.on('connection', (ws) => {
  connectedClients.add(ws);
  
  storage.getRecentChatMessages(20).then(messages => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'history', messages }));
    }
  });

  broadcastUserCount();

  ws.on('message', async (data) => {
    try {
      const messageData = JSON.parse(data.toString());
      
      if (messageData.type === 'chat_message') {
        const content = messageData.content?.trim();
        const username = messageData.username?.trim() || 'Anonymous';
        
        if (!content || content.length > 500) {
          return;
        }

        const newMessage = await storage.createChatMessage({
          username,
          content
        });

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
      req.session.isAdmin = true;
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
  const isAdmin = req.session && req.session.isAdmin;
  res.json({ isAdmin: !!isAdmin });
});

// API Routes
app.get("/api/quotes", async (req, res) => {
  try {
    const quotes = await storage.getApprovedQuotes();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quotes" });
  }
});

// Get pending quotes for admin approval
app.get("/api/quotes/pending", requireAdmin, async (req, res) => {
  try {
    const quotes = await storage.getPendingQuotes();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending quotes" });
  }
});

// Approve a quote (admin only)
app.post("/api/quotes/:id/approve", requireAdmin, async (req, res) => {
  try {
    const quote = await storage.approveQuote(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: "Failed to approve quote" });
  }
});

app.post("/api/quotes", async (req, res) => {
  try {
    const quote = await storage.createQuote(req.body);
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
    const post = await storage.createBlogPost(req.body);
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

// Serve static files
const publicPath = path.join(__dirname, '..', 'dist', 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.send('<h1>HealingHearts - Build in progress...</h1>');
  });
}

const port = parseInt(process.env.PORT || '5000', 10);
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`HealingHearts server running on port ${port}`);
});