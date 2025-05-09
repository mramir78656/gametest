import { Router, type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();
  
  // Health check
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  // Grades routes
  apiRouter.get("/grades", async (req, res) => {
    const grades = await storage.getGrades();
    res.json(grades);
  });
  
  apiRouter.get("/grades/:slug", async (req, res) => {
    const grade = await storage.getGradeBySlug(req.params.slug);
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.json(grade);
  });
  
  // Subjects routes
  apiRouter.get("/subjects", async (req, res) => {
    const subjects = await storage.getSubjects();
    res.json(subjects);
  });
  
  // Games routes
  apiRouter.get("/games", async (req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });
  
  apiRouter.get("/games/featured", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const featured = await storage.getFeaturedGames(limit);
    res.json(featured);
  });
  
  apiRouter.get("/games/:slug", async (req, res) => {
    const game = await storage.getGameBySlug(req.params.slug);
    
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    const subjects = await storage.getGameSubjects(game.id);
    
    res.json({
      ...game,
      subjects
    });
  });
  
  apiRouter.get("/games/by-grade/:gradeId", async (req, res) => {
    const gradeId = parseInt(req.params.gradeId);
    
    if (isNaN(gradeId)) {
      return res.status(400).json({ message: "Invalid grade ID" });
    }
    
    const games = await storage.getGamesByGradeId(gradeId);
    
    // Add subject information to each game
    const gamesWithSubjects = await Promise.all(
      games.map(async (game) => {
        const subjects = await storage.getGameSubjects(game.id);
        return {
          ...game,
          subjects
        };
      })
    );
    
    res.json(gamesWithSubjects);
  });
  
  // User progress routes
  apiRouter.get("/user-progress/:userId/:gameId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const gameId = parseInt(req.params.gameId);
    
    if (isNaN(userId) || isNaN(gameId)) {
      return res.status(400).json({ message: "Invalid user ID or game ID" });
    }
    
    const progress = await storage.getUserProgress(userId, gameId);
    
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }
    
    res.json(progress);
  });
  
  apiRouter.get("/user-progress/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const progress = await storage.getAllUserProgress(userId);
    res.json(progress);
  });
  
  apiRouter.post("/user-progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.updateUserProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  
  // User badges routes
  apiRouter.get("/user-badges/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const badges = await storage.getUserBadges(userId);
    res.json(badges);
  });
  
  // Mount the API routes under /api
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  
  return httpServer;
}
