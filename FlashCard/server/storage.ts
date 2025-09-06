import { type User, type InsertUser, type Quote, type InsertQuote, type ChatMessage, type InsertChatMessage, type FaqQuestion, type InsertFaqQuestion, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllQuotes(): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  
  getRecentChatMessages(limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  getAllFaqQuestions(): Promise<FaqQuestion[]>;
  createFaqQuestion(question: InsertFaqQuestion): Promise<FaqQuestion>;
  
  getAllBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quotes: Map<string, Quote>;
  private chatMessages: Map<string, ChatMessage>;
  private faqQuestions: Map<string, FaqQuestion>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.chatMessages = new Map();
    this.faqQuestions = new Map();
    this.blogPosts = new Map();
    
    // Initialize with default quotes and FAQ questions
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
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
      const id = randomUUID();
      this.quotes.set(id, {
        id,
        content: quote.content,
        author: quote.author,
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
      const id = randomUUID();
      this.faqQuestions.set(id, {
        id,
        question: faq.question,
        answer: faq.answer,
        createdAt: new Date(),
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = randomUUID();
    const quote: Quote = { 
      ...insertQuote, 
      id, 
      createdAt: new Date(),
      author: insertQuote.author || "Unknown"
    };
    this.quotes.set(id, quote);
    return quote;
  }

  async getRecentChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, limit)
      .reverse();
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date() 
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getAllFaqQuestions(): Promise<FaqQuestion[]> {
    return Array.from(this.faqQuestions.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createFaqQuestion(insertQuestion: InsertFaqQuestion): Promise<FaqQuestion> {
    const id = randomUUID();
    const question: FaqQuestion = { 
      ...insertQuestion, 
      id, 
      createdAt: new Date() 
    };
    this.faqQuestions.set(id, question);
    return question;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = { 
      ...insertPost, 
      id, 
      createdAt: new Date(),
      author: insertPost.author || "Anonymous"
    };
    this.blogPosts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();
