// Game type definitions
export interface Game {
  id: number;
  title: string;
  slug: string;
  description: string;
  instructions?: string;
  educationalBenefits?: string;
  thumbnail: string;
  gameType: string;
  gradeId: number;
  isPremium: boolean;
  isActive: boolean;
  difficulty?: string;
  tags?: string[];
  subjects?: Subject[];
}

// Grade type definitions
export interface Grade {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  color: string;
  icon: string;
}

// Subject type definitions
export interface Subject {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

// User progress type definition
export interface UserProgress {
  id: number;
  userId: number;
  gameId: number;
  level: number;
  score: number;
  completedAt?: Date;
  lastPlayed: Date;
}

// Badge type definition
export interface Badge {
  id: number;
  name: string;
  description?: string;
  icon: string;
  requirements?: any;
}

// User type definition
export interface User {
  id: number;
  username: string;
  displayName?: string;
  role?: string;
}

// Game subject filter options
export interface SubjectFilter {
  id: number | null;
  name: string;
  slug?: string;
  active: boolean;
}
