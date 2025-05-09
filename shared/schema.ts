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
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  slug: true,
  icon: true,
  color: true,
});

// Game table and schemas
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  instructions: text("instructions"),
  educationalBenefits: text("educational_benefits"),
  thumbnail: text("thumbnail"),
  gameType: text("game_type").notNull(), // phaser, createjs, etc.
  gradeId: integer("grade_id").notNull(),
  isPremium: boolean("is_premium").default(false),
  isActive: boolean("is_active").default(true),
  difficulty: text("difficulty"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  slug: true,
  description: true,
  instructions: true,
  educationalBenefits: true,
  thumbnail: true,
  gameType: true,
  gradeId: true,
  isPremium: true,
  isActive: true,
  difficulty: true,
  tags: true,
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
