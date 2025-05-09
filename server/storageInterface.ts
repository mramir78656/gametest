import {
  User, InsertUser,
  Grade, InsertGrade,
  Subject, InsertSubject,
  Game, InsertGame,
  GameSubject, InsertGameSubject,
  UserProgress, InsertUserProgress,
  Badge, InsertBadge,
  UserBadge, InsertUserBadge,
  Achievement, InsertAchievement,
  UserAchievement, InsertUserAchievement,
  VirtualItem, InsertVirtualItem,
  UserVirtualItem, InsertUserVirtualItem,
  GameAnalytic, InsertGameAnalytic
} from "@shared/schema";

// Comprehensive Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Grade methods
  getGrades(): Promise<Grade[]>;
  getGradeBySlug(slug: string): Promise<Grade | undefined>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  
  // Subject methods
  getSubjects(): Promise<Subject[]>;
  getSubjectBySlug(slug: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // Game methods
  getGames(): Promise<Game[]>;
  getGameById(id: number): Promise<Game | undefined>;
  getGameBySlug(slug: string): Promise<Game | undefined>;
  getGamesByGradeId(gradeId: number): Promise<Game[]>;
  getFeaturedGames(limit?: number): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Game-Subject relationship methods
  getGameSubjects(gameId: number): Promise<Subject[]>;
  addGameSubject(gameSubject: InsertGameSubject): Promise<GameSubject>;
  
  // User Progress methods
  getUserProgress(userId: number, gameId: number): Promise<UserProgress | undefined>;
  getAllUserProgress(userId: number): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Badge methods
  getBadges(): Promise<Badge[]>;
  getBadgeById(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // User Badge methods
  getUserBadges(userId: number): Promise<Badge[]>;
  awardBadge(userBadge: InsertUserBadge): Promise<UserBadge>;

  // Achievement methods
  getAchievements(): Promise<Achievement[]>;
  getAchievementById(id: number): Promise<Achievement | undefined>;
  getAchievementsByGameId(gameId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // User Achievement methods
  getUserAchievements(userId: number): Promise<Achievement[]>;
  awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;

  // Virtual Item methods
  getVirtualItems(): Promise<VirtualItem[]>;
  getVirtualItemById(id: number): Promise<VirtualItem | undefined>;
  createVirtualItem(virtualItem: InsertVirtualItem): Promise<VirtualItem>;

  // User Virtual Item methods
  getUserVirtualItems(userId: number): Promise<VirtualItem[]>;
  acquireVirtualItem(userVirtualItem: InsertUserVirtualItem): Promise<UserVirtualItem>;
  equipVirtualItem(userId: number, itemId: number, equipped: boolean): Promise<UserVirtualItem | undefined>;

  // Game Analytics methods
  createGameAnalytics(analytics: InsertGameAnalytic): Promise<GameAnalytic>;
  getGameAnalyticsByUserId(userId: number): Promise<GameAnalytic[]>;
  getGameAnalyticsByGameId(gameId: number): Promise<GameAnalytic[]>;
}