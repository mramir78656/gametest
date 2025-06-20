import {
  User, InsertUser, users,
  Grade, InsertGrade, grades,
  Subject, InsertSubject, subjects,
  Game, InsertGame, games,
  GameSubject, InsertGameSubject, gameSubjects,
  UserProgress, InsertUserProgress, userProgress,
  Badge, InsertBadge, badges,
  UserBadge, InsertUserBadge, userBadges
} from "@shared/schema";
import { IStorage } from "./storageInterface";
import { DatabaseStorage } from './databaseStorage';

// Storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private grades: Map<number, Grade>;
  private subjects: Map<number, Subject>;
  private games: Map<number, Game>;
  private gameSubjects: Map<number, GameSubject>;
  private userProgress: Map<string, UserProgress>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  
  private currentUserId: number;
  private currentGameSubjectId: number;
  private currentUserProgressId: number;
  private currentUserBadgeId: number;

  constructor() {
    this.users = new Map();
    this.grades = new Map();
    this.subjects = new Map();
    this.games = new Map();
    this.gameSubjects = new Map();
    this.userProgress = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    
    this.currentUserId = 1;
    this.currentGameSubjectId = 1;
    this.currentUserProgressId = 1;
    this.currentUserBadgeId = 1;
    
    // Initialize with mock data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Grade methods
  async getGrades(): Promise<Grade[]> {
    return Array.from(this.grades.values())
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }
  
  async getGradeBySlug(slug: string): Promise<Grade | undefined> {
    return Array.from(this.grades.values()).find(
      (grade) => grade.slug === slug
    );
  }
  
  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const id = Math.max(...Array.from(this.grades.keys()), 0) + 1;
    const grade: Grade = { ...insertGrade, id };
    this.grades.set(id, grade);
    return grade;
  }
  
  // Subject methods
  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }
  
  async getSubjectBySlug(slug: string): Promise<Subject | undefined> {
    return Array.from(this.subjects.values()).find(
      (subject) => subject.slug === slug
    );
  }
  
  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = Math.max(...Array.from(this.subjects.keys()), 0) + 1;
    const subject: Subject = { ...insertSubject, id };
    this.subjects.set(id, subject);
    return subject;
  }
  
  // Game methods
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGameById(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async getGameBySlug(slug: string): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(
      (game) => game.slug === slug
    );
  }
  
  async getGamesByGradeId(gradeId: number): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.gradeId === gradeId
    );
  }
  
  async getFeaturedGames(limit: number = 5): Promise<Game[]> {
    // For demo, just return first N games as featured
    return Array.from(this.games.values()).slice(0, limit);
  }
  
  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = Math.max(...Array.from(this.games.keys()), 0) + 1;
    const game: Game = { 
      ...insertGame, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.games.set(id, game);
    return game;
  }
  
  // Game-Subject relationship methods
  async getGameSubjects(gameId: number): Promise<Subject[]> {
    const subjectIds = Array.from(this.gameSubjects.values())
      .filter(gs => gs.gameId === gameId)
      .map(gs => gs.subjectId);
    
    return Array.from(this.subjects.values()).filter(
      subject => subjectIds.includes(subject.id)
    );
  }
  
  async addGameSubject(insertGameSubject: InsertGameSubject): Promise<GameSubject> {
    const id = this.currentGameSubjectId++;
    const gameSubject: GameSubject = { ...insertGameSubject, id };
    this.gameSubjects.set(id, gameSubject);
    return gameSubject;
  }
  
  // User Progress methods
  async getUserProgress(userId: number, gameId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${gameId}`;
    return this.userProgress.get(key);
  }
  
  async getAllUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      progress => progress.userId === userId
    );
  }
  
  async updateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const key = `${insertProgress.userId}-${insertProgress.gameId}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const updated: UserProgress = {
        ...existing,
        level: insertProgress.level !== undefined ? insertProgress.level : existing.level,
        score: insertProgress.score !== undefined ? insertProgress.score : existing.score,
        completedAt: insertProgress.completedAt !== undefined ? insertProgress.completedAt : existing.completedAt,
        lastPlayed: new Date()
      };
      
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const id = this.currentUserProgressId++;
      const progress: UserProgress = {
        ...insertProgress,
        id,
        lastPlayed: new Date()
      };
      
      this.userProgress.set(key, progress);
      return progress;
    }
  }
  
  // Badge methods
  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }
  
  async getBadgeById(id: number): Promise<Badge | undefined> {
    return this.badges.get(id);
  }
  
  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = this.badges.size + 1;
    const badge: Badge = { ...insertBadge, id };
    this.badges.set(id, badge);
    return badge;
  }
  
  // User Badge methods
  async getUserBadges(userId: number): Promise<Badge[]> {
    const userBadgeEntries = Array.from(this.userBadges.values())
      .filter(ub => ub.userId === userId);
    
    return userBadgeEntries.map(ub => 
      this.badges.get(ub.badgeId)!
    );
  }
  
  async awardBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const id = this.currentUserBadgeId++;
    const userBadge: UserBadge = {
      ...insertUserBadge,
      id,
      awardedAt: new Date()
    };
    
    this.userBadges.set(id, userBadge);
    return userBadge;
  }

  // Achievement methods (minimal implementation to satisfy interface)
  async getAchievements() {
    return [];
  }

  async getAchievementById() {
    return undefined;
  }

  async getAchievementsByGameId() {
    return [];
  }

  async createAchievement(achievement: any) {
    return achievement;
  }

  // User Achievement methods (minimal implementation to satisfy interface)
  async getUserAchievements() {
    return [];
  }

  async awardAchievement(userAchievement: any) {
    return userAchievement;
  }

  // Virtual Item methods (minimal implementation to satisfy interface)
  async getVirtualItems() {
    return [];
  }

  async getVirtualItemById() {
    return undefined;
  }

  async createVirtualItem(virtualItem: any) {
    return virtualItem;
  }

  // User Virtual Item methods (minimal implementation to satisfy interface)
  async getUserVirtualItems() {
    return [];
  }

  async acquireVirtualItem(userVirtualItem: any) {
    return userVirtualItem;
  }

  async equipVirtualItem() {
    return undefined;
  }

  // Game Analytics methods (minimal implementation to satisfy interface)
  async createGameAnalytics(analytics: any) {
    return analytics;
  }

  async getGameAnalyticsByUserId() {
    return [];
  }

  async getGameAnalyticsByGameId() {
    return [];
  }
  
  // Initialize with mock data
  private initializeData() {
    // Add mock data initialization if needed
  }
}

// Use MemStorage for development without database
export const storage = new MemStorage();

// Use DatabaseStorage for production with database
// export const storage = new DatabaseStorage();