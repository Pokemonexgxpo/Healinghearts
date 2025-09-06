import { type Request, type Response, type NextFunction } from "express";

// Admin authentication middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Admin access required" });
  }
}