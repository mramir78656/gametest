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
    // Add grades
    const gradesData = [
      { id: 1, name: "PreK", slug: "prek", displayOrder: 1, color: "#FF9F1C", icon: "star", description: "Games for Pre-Kindergarten students ages 3-5" },
      { id: 2, name: "Kindergarten", slug: "kindergarten", displayOrder: 2, color: "#FF4D6D", icon: "apple-alt", description: "Games for Kindergarten students ages 5-6" },
      { id: 3, name: "1st Grade", slug: "grade-1", displayOrder: 3, color: "#7209B7", icon: "pencil-alt", description: "Games for 1st Grade students ages 6-7" },
      { id: 4, name: "2nd Grade", slug: "grade-2", displayOrder: 4, color: "#4CC9F0", icon: "book", description: "Games for 2nd Grade students ages 7-8" },
      { id: 5, name: "3rd Grade", slug: "grade-3", displayOrder: 5, color: "#8AC926", icon: "calculator", description: "Games for 3rd Grade students ages 8-9" },
      { id: 6, name: "4th Grade", slug: "grade-4", displayOrder: 6, color: "#1982C4", icon: "globe-americas", description: "Games for 4th Grade students ages 9-10" },
    ];
    
    gradesData.forEach(grade => this.grades.set(grade.id, grade));

    // Add subjects
    const subjectsData = [
      { id: 1, name: "Math", slug: "math", icon: "calculator", color: "#4361ee", displayOrder: 1, description: "Games that teach math concepts and skills" },
      { id: 2, name: "Reading", slug: "reading", icon: "book", color: "#7209b7", displayOrder: 2, description: "Games that improve reading and literacy" },
      { id: 3, name: "Science", slug: "science", icon: "flask", color: "#38b000", displayOrder: 3, description: "Games that explore scientific concepts" },
      { id: 4, name: "Social Studies", slug: "social-studies", icon: "globe", color: "#fb8500", displayOrder: 4, description: "Games about history, geography, and culture" },
      { id: 5, name: "Art", slug: "art", icon: "palette", color: "#f72585", displayOrder: 5, description: "Games that inspire creativity and artistic expression" },
      { id: 6, name: "Music", slug: "music", icon: "music", color: "#3a0ca3", displayOrder: 6, description: "Games that teach music skills and appreciation" },
      { id: 7, name: "Typing", slug: "typing", icon: "keyboard", color: "#4895ef", displayOrder: 7, description: "Games that help develop typing skills" },
      { id: 8, name: "Logic", slug: "logic", icon: "brain", color: "#ff9f1c", displayOrder: 8, description: "Games that develop critical thinking and problem solving" },
    ];
    
    subjectsData.forEach(subject => this.subjects.set(subject.id, subject));

    // Add sample games for each grade
    const gamesData = [
      // 1st Grade Games
      {
        id: 21,
        title: "Addition Arcade",
        slug: "addition-arcade",
        description: "Solve addition problems to earn stars in this colorful arcade game! Perfect for 1st graders learning basic math.",
        instructions: "Look at the math problem and type your answer. Click Check Answer to see if you're correct!",
        educationalBenefits: "Practice basic addition, develop number sense, build math confidence",
        thumbnail: "addition-arcade.jpg",
        gameType: "react" as const,
        gradeId: 3, // 1st Grade
        isPremium: false,
        isActive: true,
        difficulty: "easy" as const,
        tags: ["addition", "math", "numbers"],
        createdAt: new Date(),
        updatedAt: new Date(),
        hasTextToSpeech: true,
        hasHighContrastMode: true,
        hasKeyboardControls: true,
        minPlayTime: 5,
        maxPlayTime: 15,
        averageRating: 4.9,
        learningOutcomes: "Students will master basic addition facts 1-10",
        curriculumStandards: "Meets Common Core Math Standards 1.OA.A.1",
        accessibility: "Keyboard controls, high contrast mode"
      },
      {
        id: 22,
        title: "Subtraction Safari",
        slug: "subtraction-safari",
        description: "Help safari animals learn subtraction! Solve problems to discover amazing animals in their natural habitats.",
        instructions: "Count the animals and solve the subtraction problem. Find safari animals as you learn!",
        educationalBenefits: "Practice subtraction, learn about animals, develop counting skills",
        thumbnail: "subtraction-safari.jpg",
        gameType: "react" as const,
        gradeId: 3, // 1st Grade
        isPremium: false,
        isActive: true,
        difficulty: "easy" as const,
        tags: ["subtraction", "math", "animals"],
        createdAt: new Date(),
        updatedAt: new Date(),
        hasTextToSpeech: true,
        hasHighContrastMode: true,
        hasKeyboardControls: true,
        minPlayTime: 5,
        maxPlayTime: 15,
        averageRating: 4.8,
        learningOutcomes: "Students will master basic subtraction facts 1-10",
        curriculumStandards: "Meets Common Core Math Standards 1.OA.A.1",
        accessibility: "Keyboard controls, visual counting aids"
      },
      {
        id: 23,
        title: "Spelling Bee Garden",
        slug: "spelling-bee-garden",
        description: "Listen to words and spell them correctly to grow a beautiful flower garden! Audio-based spelling practice.",
        instructions: "Listen to the word, then type the spelling. Grow flowers for each correct answer!",
        educationalBenefits: "Improve spelling, enhance listening skills, build vocabulary",
        thumbnail: "spelling-bee-garden.jpg",
        gameType: "react" as const,
        gradeId: 3, // 1st Grade
        isPremium: false,
        isActive: true,
        difficulty: "easy" as const,
        tags: ["spelling", "reading", "phonics"],
        createdAt: new Date(),
        updatedAt: new Date(),
        hasTextToSpeech: true,
        hasHighContrastMode: true,
        hasKeyboardControls: true,
        minPlayTime: 5,
        maxPlayTime: 12,
        averageRating: 4.9,
        learningOutcomes: "Students will improve spelling of common 1st grade words",
        curriculumStandards: "Meets Common Core Language Standards 1.L.2",
        accessibility: "Audio pronunciation, keyboard controls"
      },
      {
        id: 24,
        title: "Sight Word Memory",
        slug: "sight-word-memory",
        description: "Match pairs of sight words in this memory game! Learn essential reading words through fun gameplay.",
        instructions: "Click cards to flip them and find matching sight word pairs. Remember where each word is!",
        educationalBenefits: "Learn sight words, improve memory, enhance reading fluency",
        thumbnail: "sight-word-memory.jpg",
        gameType: "react" as const,
        gradeId: 3, // 1st Grade
        isPremium: false,
        isActive: true,
        difficulty: "easy" as const,
        tags: ["sight-words", "reading", "memory"],
        createdAt: new Date(),
        updatedAt: new Date(),
        hasTextToSpeech: true,
        hasHighContrastMode: true,
        hasKeyboardControls: true,
        minPlayTime: 5,
        maxPlayTime: 10,
        averageRating: 4.8,
        learningOutcomes: "Students will recognize common sight words instantly",
        curriculumStandards: "Meets Common Core Reading Standards 1.RF.3.g",
        accessibility: "Keyboard navigation, high contrast mode"
      },
      // 2nd Grade Games
      {
        id: 100,
        title: "Space Math Explorer",
        slug: "space-math-explorer",
        description: "Blast off into space and solve 2-digit addition and subtraction problems! Help the astronaut collect stars and fuel for the rocket ship.",
        instructions: "Solve math problems to power your rocket and explore different planets. Use the number pad or click on answers!",
        educationalBenefits: "Master 2-digit addition and subtraction, develop mental math skills, practice regrouping",
        thumbnail: "space-math-explorer.jpg",
        gameType: "react" as const,
        gradeId: 4, // 2nd Grade
        isPremium: false,
        isActive: true,
        difficulty: "medium" as const,
        tags: ["addition", "subtraction", "2-digit", "space"],
        createdAt: new Date(),
        updatedAt: new Date(),
        hasTextToSpeech: true,
        hasHighContrastMode: true,
        hasKeyboardControls: true,
        minPlayTime: 8,
        maxPlayTime: 15,
        averageRating: 4.9,
        learningOutcomes: "Students will solve 2-digit addition and subtraction with regrouping",
        curriculumStandards: "Meets Common Core Math Standards 2.NBT.B.5-7",
        accessibility: "Large space-themed buttons, clear number display, audio feedback"
      },
      {
        id: 101,
        title: "Pirate Treasure Multiplication",
        slug: "pirate-treasure-multiplication",
        description: "Ahoy matey! Help Captain Multiply find buried treasure by solving multiplication tables from 1-5. Dig up coins and gems!",
        instructions: "Click on treasure chests with the correct multiplication answers. Avoid the wrong answers or you'll wake the sea monsters!",
        educationalBenefits: "Learn multiplication tables 1-5, develop quick recall, understand multiplication concepts",
        thumbnail: "pirate-treasure-multiplication.jpg",
        gameType: "react" as const,
        gradeId: 4, // 2nd Grade
        isPremium: false,
        isActive: true,
        difficulty: "medium" as const,
        tags: ["multiplication", "times-tables", "pirates", "treasure"],
        createdAt: new Date(),
        updatedAt: new Date(),
        hasTextToSpeech: true,
        hasHighContrastMode: true,
        hasKeyboardControls: true,
        minPlayTime: 10,
        maxPlayTime: 18,
        averageRating: 4.8,
        learningOutcomes: "Students will master multiplication facts 1-5",
        curriculumStandards: "Meets Common Core Math Standards 2.OA.A.1",
        accessibility: "Pirate voice narration, colorful treasure visuals, large click targets"
      },
      // 3rd Grade Games
      {
        id: 200,
        title: "AI Robot Builder",
        slug: "ai-robot-builder",
        description: "Design and program your own AI robot! Learn basic coding concepts while building amazing robots with different abilities.",
        instructions: "Drag code blocks to program your robot, test its movements, and complete challenges!",
        educationalBenefits: "Learn basic programming logic, understand AI concepts, develop problem-solving skills, practice sequential thinking",
        thumbnail: "ai-robot-builder.jpg",
        gameType: "react" as const,
        gradeId: 5, // 3rd Grade
        isPremium: false,
        isActive: true,
        difficulty: "medium" as const,
        tags: ["ai", "programming", "robotics", "logic"],
        createdAt: new Date(),
        updatedAt: new Date(),
        hasTextToSpeech: true,
        hasHighContrastMode: true,
        hasKeyboardControls: true,
        minPlayTime: 10,
        maxPlayTime: 25,
        averageRating: 4.9,
        learningOutcomes: "Students will understand basic programming concepts and AI logic",
        curriculumStandards: "Meets CSTA Computer Science Standards 1A-AP-10",
        accessibility: "Visual programming blocks, step-by-step tutorials, keyboard shortcuts"
      }
    ];
    
    gamesData.forEach(game => this.games.set(game.id, game));

    // Add game-subject relationships
    const gameSubjectsData = [
      { id: 1, gameId: 21, subjectId: 1 }, // Addition Arcade - Math
      { id: 2, gameId: 22, subjectId: 1 }, // Subtraction Safari - Math
      { id: 3, gameId: 23, subjectId: 2 }, // Spelling Bee Garden - Reading
      { id: 4, gameId: 24, subjectId: 2 }, // Sight Word Memory - Reading
      { id: 5, gameId: 100, subjectId: 1 }, // Space Math Explorer - Math
      { id: 6, gameId: 101, subjectId: 1 }, // Pirate Treasure Multiplication - Math
      { id: 7, gameId: 200, subjectId: 8 }, // AI Robot Builder - Logic
    ];
    
    gameSubjectsData.forEach(gs => this.gameSubjects.set(gs.id, gs));
  }
}

// Use MemStorage for development without database
export const storage = new MemStorage();

// Use DatabaseStorage for production with database
// export const storage = new DatabaseStorage();