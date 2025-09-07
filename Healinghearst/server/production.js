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
      { content: "Healing isn't linear. Some days will be harder than others.", author: "Unknown" },
      { content: "You are stronger than you think and more resilient than you feel.", author: "Unknown" },
      { content: "Progress, not perfection.", author: "Unknown" },
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
        answer: "No, not at all. Sometimes the world can be a hard place to navigate and unfortunately sometimes people self harm as a way to \"cope\" but it isn't. It just makes things worse. Take a deep breath and you got this! Try doing other things to take your mind off of it, like taking a walk or biking, or even doing chores! Need anything, send a text at my email: Reachanya@09.gmail.com"
      },
      {
        question: "How do I know if I need to talk to someone?",
        answer: "If your thoughts are interfering with your work or being happy, or you have the strong urge to self harm, then you should really talk to someone like a friend or parent. There are suicide crisis lifelines that you can talk to: a famous one being 988 and please feel free to shoot me an email: Reachanya@09.gmail.com"
      },
      {
        question: "I'm gay/bisexual or trans, am I less of a person? What if my family doesn't support me?",
        answer: "Being gay or trans or anything does NOT mean you are less of a person. It just means you might identify differently than what \"normal\" people do and that's ok. Many people fall under this category. If your family doesn't support you, maybe they have different ideals and beliefs but that doesn't make it ok. I'm sorry that you go through that, consider talking to them about it."
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
        answer: "Someone's brain which works in a fascinating and unique way not considered to be \"normal\" but the secret is, everyone in this world is a little neurodivergent in their own way."
      },
      {
        question: "I feel underconfident in my body, I'm too fat/skinny?",
        answer: "Everyone's body is different and you don't always have to compare yourself to everyone you see in school, work or social media where most people compare themselves. Everyone is beautiful in their own way."
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
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "notmilo3455";
    
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