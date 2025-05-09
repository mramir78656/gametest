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

// Storage interface
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
}

// Mock data for development
const mockGrades = [
  { id: 1, name: "PreK", slug: "prek", displayOrder: 1, color: "#FF9F1C", icon: "star" },
  { id: 2, name: "Kindergarten", slug: "kindergarten", displayOrder: 2, color: "#FF4D6D", icon: "apple-alt" },
  { id: 3, name: "1st Grade", slug: "grade-1", displayOrder: 3, color: "#7209B7", icon: "pencil-alt" },
  { id: 4, name: "2nd Grade", slug: "grade-2", displayOrder: 4, color: "#4CC9F0", icon: "book" },
  { id: 5, name: "3rd Grade", slug: "grade-3", displayOrder: 5, color: "#8AC926", icon: "calculator" },
  { id: 6, name: "4th Grade", slug: "grade-4", displayOrder: 6, color: "#1982C4", icon: "globe-americas" },
  { id: 7, name: "5th Grade", slug: "grade-5", displayOrder: 7, color: "#6A4C93", icon: "atom" },
  { id: 8, name: "6th Grade", slug: "grade-6", displayOrder: 8, color: "#F15BB5", icon: "microscope" },
];

const mockSubjects = [
  { id: 1, name: "Math", slug: "math", icon: "calculator", color: "#4361ee" },
  { id: 2, name: "Reading", slug: "reading", icon: "book", color: "#7209b7" },
  { id: 3, name: "Science", slug: "science", icon: "flask", color: "#38b000" },
  { id: 4, name: "Social Studies", slug: "social-studies", icon: "globe", color: "#fb8500" },
  { id: 5, name: "Art", slug: "art", icon: "palette", color: "#f72585" },
  { id: 6, name: "Music", slug: "music", icon: "music", color: "#3a0ca3" },
  { id: 7, name: "Typing", slug: "typing", icon: "keyboard", color: "#4895ef" },
  { id: 8, name: "Creativity", slug: "creativity", icon: "paint-brush", color: "#ff9f1c" },
];

const mockGames = [
  {
    id: 1,
    title: "Math Adventure",
    slug: "math-adventure",
    description: "Join Captain Matheo on an exciting adventure through Number Island! Solve addition, subtraction, multiplication and division puzzles to unlock treasures and defeat the Math Monster.",
    instructions: "Use your mouse or touchscreen to select answers. Arrow keys can be used for movement on desktop.",
    educationalBenefits: "Practice basic arithmetic operations, develop mental math skills, learn problem-solving strategies, build math confidence through gameplay.",
    thumbnail: "math-adventure.jpg",
    gameType: "phaser",
    gradeId: 5, // 3rd Grade
    isPremium: false,
    isActive: true,
    difficulty: "medium",
    tags: ["addition", "subtraction", "multiplication", "division"]
  },
  {
    id: 2,
    title: "Word Wizards",
    slug: "word-wizards",
    description: "Become a Word Wizard by mastering spelling and vocabulary! Cast letter spells to create words and defeat the spelling monsters.",
    instructions: "Click on letters to spell words. Submit your answers by pressing the magic wand button.",
    educationalBenefits: "Improve spelling skills, expand vocabulary, practice word recognition, enhance reading comprehension.",
    thumbnail: "word-wizards.jpg",
    gameType: "phaser",
    gradeId: 3, // 1st Grade
    isPremium: false,
    isActive: true,
    difficulty: "easy",
    tags: ["spelling", "vocabulary", "reading"]
  },
  {
    id: 3,
    title: "Science Lab",
    slug: "science-lab",
    description: "Conduct virtual experiments in your own Science Lab! Mix chemicals, observe reactions, and learn scientific concepts through hands-on activities.",
    instructions: "Drag and drop elements to combine them. Use tools from your toolkit to measure and analyze results.",
    educationalBenefits: "Learn scientific method, understand basic chemistry concepts, develop critical thinking skills, practice observation and analysis.",
    thumbnail: "science-lab.jpg",
    gameType: "phaser",
    gradeId: 7, // 5th Grade
    isPremium: false,
    isActive: true,
    difficulty: "hard",
    tags: ["experiments", "chemistry", "scientific-method"]
  },
  {
    id: 4,
    title: "Typing Adventure",
    slug: "typing-adventure",
    description: "Race through the forest by typing words correctly! Improve your typing speed and accuracy while having fun.",
    instructions: "Type the words that appear on the screen as quickly and accurately as possible to move your character forward.",
    educationalBenefits: "Develop typing skills, improve keyboard familiarity, enhance finger placement, increase typing speed and accuracy.",
    thumbnail: "typing-adventure.jpg",
    gameType: "createjs",
    gradeId: 4, // 2nd Grade
    isPremium: false,
    isActive: true,
    difficulty: "medium",
    tags: ["typing", "keyboard-skills", "speed"]
  },
  {
    id: 5,
    title: "Geography Explorer",
    slug: "geography-explorer",
    description: "Travel the world as a Geography Explorer! Visit different countries, learn about landmarks, and discover diverse cultures.",
    instructions: "Click on the map to answer geography questions. Collect stamps in your passport for correct answers.",
    educationalBenefits: "Learn world geography, understand cultural diversity, improve map reading skills, memorize countries and capitals.",
    thumbnail: "geography-explorer.jpg",
    gameType: "phaser",
    gradeId: 6, // 4th Grade
    isPremium: false,
    isActive: true,
    difficulty: "medium",
    tags: ["geography", "countries", "maps", "cultures"]
  },
  {
    id: 6,
    title: "ABC Animals",
    slug: "abc-animals",
    description: "Learn the alphabet with cute animal friends! Match letters to animals and hear the sounds they make.",
    instructions: "Click on the letter that matches the animal shown. Listen to the sound and repeat the letter name.",
    educationalBenefits: "Learn alphabet recognition, associate letters with animals, develop phonemic awareness, practice letter sounds.",
    thumbnail: "abc-animals.jpg",
    gameType: "createjs",
    gradeId: 1, // PreK
    isPremium: false,
    isActive: true,
    difficulty: "easy",
    tags: ["alphabet", "animals", "phonics"]
  },
  {
    id: 7,
    title: "Counting Fun",
    slug: "counting-fun",
    description: "Count objects, match numbers, and solve simple addition problems in this colorful counting game.",
    instructions: "Count the objects and click on the correct number. Drag objects to solve addition problems.",
    educationalBenefits: "Practice counting skills, recognize numbers, understand quantities, introduce basic addition concepts.",
    thumbnail: "counting-fun.jpg",
    gameType: "phaser",
    gradeId: 1, // PreK
    isPremium: false,
    isActive: true,
    difficulty: "easy",
    tags: ["counting", "numbers", "addition"]
  },
  {
    id: 8,
    title: "Shape Match",
    slug: "shape-match",
    description: "Learn about shapes by matching them to everyday objects. Discover polygons, circles, and more!",
    instructions: "Drag shapes to match with the corresponding objects. Complete the puzzle to unlock new levels.",
    educationalBenefits: "Recognize geometric shapes, understand shape properties, improve spatial reasoning, connect shapes to real-world objects.",
    thumbnail: "shape-match.jpg",
    gameType: "createjs",
    gradeId: 1, // PreK
    isPremium: true,
    isActive: true,
    difficulty: "easy",
    tags: ["shapes", "geometry", "matching"]
  },
  {
    id: 9,
    title: "Color World",
    slug: "color-world",
    description: "Explore a vibrant world of colors! Mix primary colors, create art, and learn color recognition.",
    instructions: "Click on colors to select them. Mix colors by clicking the mixing pot. Paint objects with your chosen colors.",
    educationalBenefits: "Learn color recognition, understand color mixing, express creativity through art, develop fine motor skills.",
    thumbnail: "color-world.jpg",
    gameType: "phaser",
    gradeId: 1, // PreK
    isPremium: false,
    isActive: true,
    difficulty: "easy",
    tags: ["colors", "painting", "creativity"]
  }
];

const mockGameSubjects = [
  { id: 1, gameId: 1, subjectId: 1 }, // Math Adventure - Math
  { id: 2, gameId: 2, subjectId: 2 }, // Word Wizards - Reading
  { id: 3, gameId: 3, subjectId: 3 }, // Science Lab - Science
  { id: 4, gameId: 4, subjectId: 7 }, // Typing Adventure - Typing
  { id: 5, gameId: 5, subjectId: 4 }, // Geography Explorer - Social Studies
  { id: 6, gameId: 6, subjectId: 2 }, // ABC Animals - Reading
  { id: 7, gameId: 7, subjectId: 1 }, // Counting Fun - Math
  { id: 8, gameId: 8, subjectId: 1 }, // Shape Match - Math
  { id: 9, gameId: 9, subjectId: 8 }, // Color World - Creativity
];

const mockBadges = [
  { id: 1, name: "Quick Solver", description: "Complete a game in record time", icon: "bolt", requirements: { timeUnder: 60 } },
  { id: 2, name: "Perfect Score", description: "Get 100% on any game", icon: "star", requirements: { score: 100 } },
  { id: 3, name: "Math Master", description: "Complete all math games", icon: "trophy", requirements: { completeAllInSubject: 1 } },
  { id: 4, name: "Problem Solver", description: "Solve 50 problems across all games", icon: "puzzle-piece", requirements: { totalProblems: 50 } },
];

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
    this.currentGameSubjectId = mockGameSubjects.length + 1;
    this.currentUserProgressId = 1;
    this.currentUserBadgeId = 1;
    
    // Initialize with mock data
    mockGrades.forEach(grade => this.grades.set(grade.id, grade));
    mockSubjects.forEach(subject => this.subjects.set(subject.id, subject));
    mockGames.forEach(game => this.games.set(game.id, game));
    mockGameSubjects.forEach(gs => this.gameSubjects.set(gs.id, gs));
    mockBadges.forEach(badge => this.badges.set(badge.id, badge));
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
      .sort((a, b) => a.displayOrder - b.displayOrder);
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
    const game: Game = { ...insertGame, id };
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
        level: insertProgress.level ?? existing.level,
        score: insertProgress.score ?? existing.score,
        completedAt: insertProgress.completedAt ?? existing.completedAt,
        lastPlayed: new Date(),
      };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const id = this.currentUserProgressId++;
      const progress: UserProgress = {
        ...insertProgress,
        id,
        lastPlayed: new Date(),
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
    const id = Math.max(...Array.from(this.badges.keys()), 0) + 1;
    const badge: Badge = { ...insertBadge, id };
    this.badges.set(id, badge);
    return badge;
  }
  
  // User Badge methods
  async getUserBadges(userId: number): Promise<Badge[]> {
    const badgeIds = Array.from(this.userBadges.values())
      .filter(ub => ub.userId === userId)
      .map(ub => ub.badgeId);
    
    return Array.from(this.badges.values()).filter(
      badge => badgeIds.includes(badge.id)
    );
  }
  
  async awardBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const id = this.currentUserBadgeId++;
    const userBadge: UserBadge = {
      ...insertUserBadge,
      id,
      awardedAt: new Date(),
    };
    this.userBadges.set(id, userBadge);
    return userBadge;
  }
}

export const storage = new MemStorage();
