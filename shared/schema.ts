import { pgTable, text, serial, integer, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table and schemas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  role: text("role").default("student"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  role: true,
});

// Grade table and schemas
export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  displayOrder: integer("display_order").notNull(),
  color: text("color").notNull(),
  icon: text("icon"),
});

export const insertGradeSchema = createInsertSchema(grades).pick({
  name: true,
  slug: true,
  displayOrder: true,
  color: true,
  icon: true,
});

// Subject table and schemas
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  color: text("color"),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  slug: true,
  icon: true,
  color: true,
  description: true,
  displayOrder: true,
});

// Game table and schemas
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  instructions: text("instructions"),
  educationalBenefits: text("educational_benefits"),
  learningOutcomes: text("learning_outcomes"),
  curriculumStandards: text("curriculum_standards"),
  thumbnail: text("thumbnail"),
  gameType: text("game_type").notNull(), // phaser, createjs, etc.
  gradeId: integer("grade_id").notNull(),
  isPremium: boolean("is_premium").default(false),
  isActive: boolean("is_active").default(true),
  difficulty: text("difficulty"),
  tags: text("tags").array(),
  hasTextToSpeech: boolean("has_text_to_speech").default(false),
  hasHighContrast: boolean("has_high_contrast").default(false),
  hasKeyboardControls: boolean("has_keyboard_controls").default(false),
  hasGamepadSupport: boolean("has_gamepad_support").default(false),
  hasAudioFeedback: boolean("has_audio_feedback").default(false),
  minPlayTime: integer("min_play_time"),  // in minutes
  maxLevels: integer("max_levels").default(1),
  rewardPoints: integer("reward_points").default(10),
  version: text("version").default("1.0.0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  slug: true,
  description: true,
  instructions: true,
  educationalBenefits: true,
  learningOutcomes: true,
  curriculumStandards: true,
  thumbnail: true,
  gameType: true,
  gradeId: true,
  isPremium: true,
  isActive: true,
  difficulty: true,
  tags: true,
  hasTextToSpeech: true,
  hasHighContrast: true,
  hasKeyboardControls: true,
  hasGamepadSupport: true,
  hasAudioFeedback: true,
  minPlayTime: true,
  maxLevels: true,
  rewardPoints: true,
  version: true,
});

// Game to subject relationship
export const gameSubjects = pgTable("game_subjects", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  subjectId: integer("subject_id").notNull(),
});

export const insertGameSubjectSchema = createInsertSchema(gameSubjects).pick({
  gameId: true,
  subjectId: true,
});

// User progress table and schemas
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameId: integer("game_id").notNull(),
  level: integer("level").default(1),
  score: integer("score").default(0),
  completedAt: timestamp("completed_at"),
  lastPlayed: timestamp("last_played").defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  gameId: true,
  level: true,
  score: true,
  completedAt: true,
});

// Badges table and schemas
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  requirements: json("requirements"),
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  description: true,
  icon: true,
  requirements: true,
});

// User badges relationship
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  awardedAt: timestamp("awarded_at").defaultNow(),
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).pick({
  userId: true,
  badgeId: true,
});

// Game achievements table and schemas
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  gameId: integer("game_id").notNull(),
  criteria: json("criteria").notNull(),
  points: integer("points").default(10),
  isSecret: boolean("is_secret").default(false),
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  name: true,
  description: true,
  icon: true,
  gameId: true,
  criteria: true,
  points: true,
  isSecret: true,
});

// User achievements relationship
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  achievementId: true,
});

// Virtual rewards/items table
export const virtualItems = pgTable("virtual_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  itemType: text("item_type").notNull(), // avatar, background, trophy, accessory, etc.
  rarity: text("rarity").default("common"), // common, uncommon, rare, legendary
  cost: integer("cost").default(0),
  unlockCriteria: json("unlock_criteria"),
  isActive: boolean("is_active").default(true),
});

export const insertVirtualItemSchema = createInsertSchema(virtualItems).pick({
  name: true,
  description: true,
  icon: true,
  itemType: true,
  rarity: true,
  cost: true,
  unlockCriteria: true,
  isActive: true,
});

// User virtual items relationship
export const userVirtualItems = pgTable("user_virtual_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  itemId: integer("item_id").notNull(),
  acquiredAt: timestamp("acquired_at").defaultNow(),
  isEquipped: boolean("is_equipped").default(false),
});

export const insertUserVirtualItemSchema = createInsertSchema(userVirtualItems).pick({
  userId: true,
  itemId: true,
  isEquipped: true,
});

// Game analytics table
export const gameAnalytics = pgTable("game_analytics", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  userId: integer("user_id"),
  sessionStart: timestamp("session_start").defaultNow(),
  sessionEnd: timestamp("session_end"),
  duration: integer("duration"), // in seconds
  completedLevels: integer("completed_levels").default(0),
  score: integer("score").default(0),
  userAgent: text("user_agent"),
  deviceType: text("device_type"), // desktop, mobile, tablet
  ipAddress: text("ip_address"),
});

export const insertGameAnalyticsSchema = createInsertSchema(gameAnalytics).pick({
  gameId: true,
  userId: true,
  sessionStart: true,
  sessionEnd: true,
  duration: true,
  completedLevels: true,
  score: true,
  userAgent: true,
  deviceType: true,
  ipAddress: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Grade = typeof grades.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type GameSubject = typeof gameSubjects.$inferSelect;
export type InsertGameSubject = z.infer<typeof insertGameSubjectSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type VirtualItem = typeof virtualItems.$inferSelect;
export type InsertVirtualItem = z.infer<typeof insertVirtualItemSchema>;

export type UserVirtualItem = typeof userVirtualItems.$inferSelect;
export type InsertUserVirtualItem = z.infer<typeof insertUserVirtualItemSchema>;

export type GameAnalytic = typeof gameAnalytics.$inferSelect;
export type InsertGameAnalytic = z.infer<typeof insertGameAnalyticsSchema>;
