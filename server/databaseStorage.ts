import { eq, sql, desc, and, or, inArray } from "drizzle-orm";
import {
  users,
  type User,
  type InsertUser,
  grades,
  type Grade,
  type InsertGrade,
  subjects,
  type Subject,
  type InsertSubject,
  games,
  type Game,
  type InsertGame,
  gameSubjects,
  type GameSubject,
  type InsertGameSubject,
  userProgress,
  type UserProgress,
  type InsertUserProgress,
  badges,
  type Badge,
  type InsertBadge,
  userBadges,
  type UserBadge,
  type InsertUserBadge,
  achievements,
  type Achievement,
  type InsertAchievement,
  userAchievements,
  type UserAchievement,
  type InsertUserAchievement,
  virtualItems,
  type VirtualItem,
  type InsertVirtualItem,
  userVirtualItems,
  type UserVirtualItem,
  type InsertUserVirtualItem,
  gameAnalytics,
  type GameAnalytic,
  type InsertGameAnalytic
} from "@shared/schema";
import { db } from "./db";
import { IStorage } from "./storageInterface";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  // Grade methods
  async getGrades(): Promise<Grade[]> {
    return db.select().from(grades).orderBy(grades.displayOrder);
  }
  
  async getGradeBySlug(slug: string): Promise<Grade | undefined> {
    const [grade] = await db.select().from(grades).where(eq(grades.slug, slug));
    return grade;
  }
  
  async createGrade(grade: InsertGrade): Promise<Grade> {
    const [newGrade] = await db.insert(grades).values(grade).returning();
    return newGrade;
  }
  
  // Subject methods
  async getSubjects(): Promise<Subject[]> {
    return db.select().from(subjects).orderBy(subjects.displayOrder);
  }
  
  async getSubjectBySlug(slug: string): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.slug, slug));
    return subject;
  }
  
  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }
  
  // Game methods
  async getGames(): Promise<Game[]> {
    return db.select().from(games).where(eq(games.isActive, true));
  }
  
  async getGameById(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }
  
  async getGameBySlug(slug: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.slug, slug));
    return game;
  }
  
  async getGamesByGradeId(gradeId: number): Promise<Game[]> {
    return db.select()
      .from(games)
      .where(and(eq(games.gradeId, gradeId), eq(games.isActive, true)));
  }
  
  async getFeaturedGames(limit: number = 5): Promise<Game[]> {
    return db.select()
      .from(games)
      .where(eq(games.isActive, true))
      .limit(limit);
  }
  
  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }
  
  // Game-Subject relationship methods
  async getGameSubjects(gameId: number): Promise<Subject[]> {
    return db.select({
      id: subjects.id,
      name: subjects.name,
      slug: subjects.slug,
      icon: subjects.icon,
      color: subjects.color,
      description: subjects.description,
      displayOrder: subjects.displayOrder
    })
      .from(gameSubjects)
      .innerJoin(subjects, eq(gameSubjects.subjectId, subjects.id))
      .where(eq(gameSubjects.gameId, gameId));
  }
  
  async addGameSubject(gameSubject: InsertGameSubject): Promise<GameSubject> {
    const [newGameSubject] = await db.insert(gameSubjects).values(gameSubject).returning();
    return newGameSubject;
  }
  
  // User Progress methods
  async getUserProgress(userId: number, gameId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select()
      .from(userProgress)
      .where(and(
        eq(userProgress.userId, userId),
        eq(userProgress.gameId, gameId)
      ));
    
    return progress;
  }
  
  async getAllUserProgress(userId: number): Promise<UserProgress[]> {
    return db.select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }
  
  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const { userId, gameId } = progress;
    
    // Check if progress already exists
    const existingProgress = await this.getUserProgress(userId, gameId);
    
    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db.update(userProgress)
        .set({
          ...progress,
          lastPlayed: new Date()
        })
        .where(and(
          eq(userProgress.userId, userId),
          eq(userProgress.gameId, gameId)
        ))
        .returning();
      
      return updatedProgress;
    } else {
      // Create new progress
      const [newProgress] = await db.insert(userProgress)
        .values({
          ...progress,
          lastPlayed: new Date()
        })
        .returning();
      
      return newProgress;
    }
  }
  
  // Badge methods
  async getBadges(): Promise<Badge[]> {
    return db.select().from(badges);
  }
  
  async getBadgeById(id: number): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge;
  }
  
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const [newBadge] = await db.insert(badges).values(badge).returning();
    return newBadge;
  }
  
  // User Badge methods
  async getUserBadges(userId: number): Promise<Badge[]> {
    return db.select({
      id: badges.id,
      name: badges.name,
      description: badges.description,
      icon: badges.icon,
      requirements: badges.requirements
    })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId));
  }
  
  async awardBadge(userBadge: InsertUserBadge): Promise<UserBadge> {
    const [newUserBadge] = await db.insert(userBadges).values(userBadge).returning();
    return newUserBadge;
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }
  
  async getAchievementById(id: number): Promise<Achievement | undefined> {
    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, id));
    return achievement;
  }
  
  async getAchievementsByGameId(gameId: number): Promise<Achievement[]> {
    return db.select()
      .from(achievements)
      .where(eq(achievements.gameId, gameId));
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }

  // User Achievement methods
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return db.select({
      id: achievements.id,
      name: achievements.name,
      description: achievements.description,
      icon: achievements.icon,
      gameId: achievements.gameId,
      criteria: achievements.criteria,
      points: achievements.points,
      isSecret: achievements.isSecret
    })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId));
  }
  
  async awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const [newUserAchievement] = await db.insert(userAchievements).values(userAchievement).returning();
    return newUserAchievement;
  }

  // Virtual Item methods
  async getVirtualItems(): Promise<VirtualItem[]> {
    return db.select().from(virtualItems).where(eq(virtualItems.isActive, true));
  }
  
  async getVirtualItemById(id: number): Promise<VirtualItem | undefined> {
    const [item] = await db.select().from(virtualItems).where(eq(virtualItems.id, id));
    return item;
  }
  
  async createVirtualItem(virtualItem: InsertVirtualItem): Promise<VirtualItem> {
    const [newItem] = await db.insert(virtualItems).values(virtualItem).returning();
    return newItem;
  }

  // User Virtual Item methods
  async getUserVirtualItems(userId: number): Promise<VirtualItem[]> {
    return db.select({
      id: virtualItems.id,
      name: virtualItems.name,
      description: virtualItems.description,
      icon: virtualItems.icon,
      itemType: virtualItems.itemType,
      rarity: virtualItems.rarity,
      cost: virtualItems.cost,
      unlockCriteria: virtualItems.unlockCriteria,
      isActive: virtualItems.isActive
    })
      .from(userVirtualItems)
      .innerJoin(virtualItems, eq(userVirtualItems.itemId, virtualItems.id))
      .where(eq(userVirtualItems.userId, userId));
  }
  
  async acquireVirtualItem(userVirtualItem: InsertUserVirtualItem): Promise<UserVirtualItem> {
    const [newUserItem] = await db.insert(userVirtualItems).values(userVirtualItem).returning();
    return newUserItem;
  }
  
  async equipVirtualItem(userId: number, itemId: number, equipped: boolean): Promise<UserVirtualItem | undefined> {
    const [updatedUserItem] = await db.update(userVirtualItems)
      .set({ isEquipped: equipped })
      .where(and(
        eq(userVirtualItems.userId, userId),
        eq(userVirtualItems.itemId, itemId)
      ))
      .returning();
    
    return updatedUserItem;
  }

  // Game Analytics methods
  async createGameAnalytics(analytics: InsertGameAnalytic): Promise<GameAnalytic> {
    const [newAnalytics] = await db.insert(gameAnalytics).values(analytics).returning();
    return newAnalytics;
  }
  
  async getGameAnalyticsByUserId(userId: number): Promise<GameAnalytic[]> {
    return db.select()
      .from(gameAnalytics)
      .where(eq(gameAnalytics.userId, userId))
      .orderBy(desc(gameAnalytics.sessionStart));
  }
  
  async getGameAnalyticsByGameId(gameId: number): Promise<GameAnalytic[]> {
    return db.select()
      .from(gameAnalytics)
      .where(eq(gameAnalytics.gameId, gameId))
      .orderBy(desc(gameAnalytics.sessionStart));
  }
}