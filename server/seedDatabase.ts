import { db } from './db';
import {
  users,
  grades,
  subjects,
  games,
  gameSubjects,
  badges
} from '@shared/schema';

async function seedDatabase() {
  console.log('Starting database seeding...');

  // Add grades
  console.log('Seeding grades...');
  const gradesData = [
    { id: 1, name: "PreK", slug: "prek", displayOrder: 1, color: "#FF9F1C", icon: "star", description: "Games for Pre-Kindergarten students ages 3-5" },
    { id: 2, name: "Kindergarten", slug: "kindergarten", displayOrder: 2, color: "#FF4D6D", icon: "apple-alt", description: "Games for Kindergarten students ages 5-6" },
    { id: 3, name: "1st Grade", slug: "grade-1", displayOrder: 3, color: "#7209B7", icon: "pencil-alt", description: "Games for 1st Grade students ages 6-7" },
    { id: 4, name: "2nd Grade", slug: "grade-2", displayOrder: 4, color: "#4CC9F0", icon: "book", description: "Games for 2nd Grade students ages 7-8" },
    { id: 5, name: "3rd Grade", slug: "grade-3", displayOrder: 5, color: "#8AC926", icon: "calculator", description: "Games for 3rd Grade students ages 8-9" },
    { id: 6, name: "4th Grade", slug: "grade-4", displayOrder: 6, color: "#1982C4", icon: "globe-americas", description: "Games for 4th Grade students ages 9-10" },
  ];

  await db.insert(grades).values(gradesData).onConflictDoNothing();

  // Add subjects
  console.log('Seeding subjects...');
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

  await db.insert(subjects).values(subjectsData).onConflictDoNothing();

  // Add games - only adding 9 for now, we'll add the rest later
  console.log('Seeding games...');
  const gamesData = [
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
      tags: ["addition", "subtraction", "multiplication", "division"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 15,
      averageRating: 4.7,
      learningOutcomes: "Students will practice basic arithmetic and develop quick mental calculation skills",
      curriculumStandards: "Meets Common Core Math Standards 3.OA.A.1, 3.OA.B.5",
      accessibility: "Keyboard controls, text-to-speech, high contrast mode"
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
      tags: ["spelling", "vocabulary", "reading"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 10,
      averageRating: 4.8,
      learningOutcomes: "Students will improve spelling skills and build vocabulary",
      curriculumStandards: "Meets Common Core Language Standards 1.L.2, 1.L.4",
      accessibility: "Keyboard controls, text-to-speech, high contrast mode"
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
      gradeId: 6, // 4th Grade
      isPremium: false,
      isActive: true,
      difficulty: "hard",
      tags: ["experiments", "chemistry", "scientific-method"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 10,
      maxPlayTime: 20,
      averageRating: 4.6,
      learningOutcomes: "Students will understand the scientific method and basic chemistry principles",
      curriculumStandards: "Meets Next Generation Science Standards 4-PS3-2, 4-PS3-4",
      accessibility: "Keyboard controls, text-to-speech, high contrast mode"
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
      tags: ["typing", "keyboard-skills", "speed"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 15,
      averageRating: 4.5,
      learningOutcomes: "Students will improve typing speed and accuracy",
      curriculumStandards: "Meets ISTE Standards for Students 1.1.c, 1.1.d",
      accessibility: "High contrast mode, adjustable speed settings"
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
      tags: ["geography", "countries", "maps", "cultures"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 10,
      maxPlayTime: 20,
      averageRating: 4.9,
      learningOutcomes: "Students will learn geography and cultural diversity",
      curriculumStandards: "Meets Social Studies Standards SS.4.G.1, SS.4.G.2",
      accessibility: "Keyboard controls, text-to-speech, high contrast mode"
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
      tags: ["alphabet", "animals", "phonics"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 10,
      averageRating: 4.8,
      learningOutcomes: "Students will learn alphabet recognition and phonemic awareness",
      curriculumStandards: "Meets Foundational Skills Standards RF.K.1, RF.K.3",
      accessibility: "Audio instructions, large buttons, high contrast mode"
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
      tags: ["counting", "numbers", "addition"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 10,
      averageRating: 4.7,
      learningOutcomes: "Students will practice counting and number recognition",
      curriculumStandards: "Meets Common Core Math Standards K.CC.A.1, K.CC.B.4",
      accessibility: "Audio instructions, large buttons, high contrast mode"
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
      tags: ["shapes", "geometry", "matching"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 10,
      averageRating: 4.6,
      learningOutcomes: "Students will recognize shapes and understand their properties",
      curriculumStandards: "Meets Common Core Math Standards K.G.A.1, K.G.B.4",
      accessibility: "Audio instructions, large buttons, high contrast mode"
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
      tags: ["colors", "painting", "creativity"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 15,
      averageRating: 4.9,
      learningOutcomes: "Students will learn color recognition and mixing",
      curriculumStandards: "Meets Visual Arts Standards VA:Cr1.1.Ka, VA:Cr2.1.Ka",
      accessibility: "Audio instructions, large buttons, high contrast mode"
    }
  ];

  await db.insert(games).values(gamesData).onConflictDoNothing();

  // Add game subjects
  console.log('Seeding game subjects...');
  const gameSubjectsData = [
    { id: 1, gameId: 1, subjectId: 1 }, // Math Adventure - Math
    { id: 2, gameId: 2, subjectId: 2 }, // Word Wizards - Reading
    { id: 3, gameId: 3, subjectId: 3 }, // Science Lab - Science
    { id: 4, gameId: 4, subjectId: 7 }, // Typing Adventure - Typing
    { id: 5, gameId: 5, subjectId: 4 }, // Geography Explorer - Social Studies
    { id: 6, gameId: 6, subjectId: 2 }, // ABC Animals - Reading
    { id: 7, gameId: 7, subjectId: 1 }, // Counting Fun - Math
    { id: 8, gameId: 8, subjectId: 1 }, // Shape Match - Math
    { id: 9, gameId: 9, subjectId: 5 }, // Color World - Art
  ];

  await db.insert(gameSubjects).values(gameSubjectsData).onConflictDoNothing();

  // Add badges
  console.log('Seeding badges...');
  const badgesData = [
    { id: 1, name: "Quick Solver", description: "Complete a game in record time", icon: "bolt", requirements: { timeUnder: 60 } },
    { id: 2, name: "Perfect Score", description: "Get 100% on any game", icon: "star", requirements: { score: 100 } },
    { id: 3, name: "Math Master", description: "Complete all math games", icon: "trophy", requirements: { completeAllInSubject: 1 } },
    { id: 4, name: "Problem Solver", description: "Solve 50 problems across all games", icon: "puzzle-piece", requirements: { totalProblems: 50 } },
  ];

  await db.insert(badges).values(badgesData).onConflictDoNothing();

  console.log('Database seeding completed!');
}

seedDatabase()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });