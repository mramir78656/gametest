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

  // Add games - including all 20 new 1st grade games
  console.log('Seeding games...');
  const gamesData = [
    // New 1st Grade Games (20 games)
    {
      id: 21,
      title: "Addition Arcade",
      slug: "addition-arcade",
      description: "Solve addition problems to earn stars in this colorful arcade game! Perfect for 1st graders learning basic math.",
      instructions: "Look at the math problem and type your answer. Click Check Answer to see if you're correct!",
      educationalBenefits: "Practice basic addition, develop number sense, build math confidence",
      thumbnail: "addition-arcade.jpg",
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "easy",
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
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "easy",
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
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "easy",
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
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "easy",
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
    {
      id: 25,
      title: "Rhyming Rockets",
      slug: "rhyming-rockets",
      description: "Launch rockets by finding rhyming words! Space-themed phonics adventure for young learners.",
      instructions: "Find words that rhyme with the target word to launch rockets into space!",
      educationalBenefits: "Develop phonics skills, learn rhyming patterns, improve word recognition",
      thumbnail: "rhyming-rockets.jpg",
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "easy",
      tags: ["rhyming", "phonics", "reading"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 12,
      averageRating: 4.9,
      learningOutcomes: "Students will identify rhyming words and understand sound patterns",
      curriculumStandards: "Meets Common Core Reading Standards 1.RF.2.a",
      accessibility: "Audio support, space-themed visuals"
    },
    {
      id: 26,
      title: "Telling Time Puzzle",
      slug: "telling-time-puzzle",
      description: "Learn to read analog clocks with colorful time puzzles! Practice telling time to the hour and half hour.",
      instructions: "Look at the clock and choose the correct time. Learn about hour and minute hands!",
      educationalBenefits: "Learn time concepts, practice reading clocks, understand daily schedules",
      thumbnail: "telling-time-puzzle.jpg",
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "easy",
      tags: ["time", "math", "clocks"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 15,
      averageRating: 4.7,
      learningOutcomes: "Students will read analog clocks to the hour and half hour",
      curriculumStandards: "Meets Common Core Math Standards 1.MD.B.3",
      accessibility: "Large clock faces, clear time indicators"
    },
    {
      id: 27,
      title: "Animal Habitat Match",
      slug: "animal-habitat-match",
      description: "Help animals find their homes! Learn about different habitats where animals live around the world.",
      instructions: "Match each animal to its correct habitat. Learn where different animals live!",
      educationalBenefits: "Learn about animal habitats, develop classification skills, understand ecosystems",
      thumbnail: "animal-habitat-match.jpg",
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "easy",
      tags: ["science", "animals", "habitats"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 12,
      averageRating: 4.8,
      learningOutcomes: "Students will identify animal habitats and understand ecosystems",
      curriculumStandards: "Meets Next Generation Science Standards K-LS1-1",
      accessibility: "Visual habitat representations, animal sounds"
    },
    {
      id: 28,
      title: "Life Cycle Sort",
      slug: "life-cycle-sort",
      description: "Put life cycle stages in correct order! Learn how butterflies, frogs, and chickens grow and change.",
      instructions: "Drag the life cycle stages into the correct order from first to last!",
      educationalBenefits: "Understand life cycles, learn sequence and order, develop scientific thinking",
      thumbnail: "life-cycle-sort.jpg",
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "medium",
      tags: ["science", "life-cycles", "biology"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 8,
      maxPlayTime: 15,
      averageRating: 4.7,
      learningOutcomes: "Students will understand basic life cycles of common animals",
      curriculumStandards: "Meets Next Generation Science Standards 1-LS1-2",
      accessibility: "Drag and drop alternative, clear stage progression"
    },
    {
      id: 29,
      title: "Shapes & Geometry",
      slug: "shapes-geometry",
      description: "Identify shapes and learn geometry basics! Practice recognizing circles, triangles, squares, and rectangles.",
      instructions: "Look at each shape and choose its correct name. Learn about different geometric shapes!",
      educationalBenefits: "Recognize geometric shapes, develop spatial awareness, learn shape properties",
      thumbnail: "shapes-geometry.jpg",
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "easy",
      tags: ["math", "geometry", "shapes"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 12,
      averageRating: 4.8,
      learningOutcomes: "Students will identify and name basic geometric shapes",
      curriculumStandards: "Meets Common Core Math Standards 1.G.A.1",
      accessibility: "High contrast shapes, shape tracing options"
    },
    {
      id: 30,
      title: "Vowel Sorting",
      slug: "vowel-sorting",
      description: "Learn short and long vowel sounds! Listen to words and identify if they have short or long vowels.",
      instructions: "Listen to each word and decide if it has a short or long vowel sound!",
      educationalBenefits: "Distinguish vowel sounds, improve phonics skills, enhance reading ability",
      thumbnail: "vowel-sorting.jpg",
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "medium",
      tags: ["phonics", "vowels", "reading"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 12,
      averageRating: 4.9,
      learningOutcomes: "Students will distinguish between short and long vowel sounds",
      curriculumStandards: "Meets Common Core Reading Standards 1.RF.2.a",
      accessibility: "Clear audio pronunciation, visual vowel guides"
    },
    {
      id: 31,
      title: "Patterns & Sequences",
      slug: "patterns-sequences",
      description: "Find what comes next in colorful patterns! Develop logical thinking with shapes, colors, and objects.",
      instructions: "Look at the pattern and choose what comes next. Find the repeating sequence!",
      educationalBenefits: "Develop pattern recognition, logical thinking, mathematical reasoning",
      thumbnail: "patterns-sequences.jpg",
      gameType: "react",
      gradeId: 3, // 1st Grade
      isPremium: false,
      isActive: true,
      difficulty: "medium",
      tags: ["logic", "patterns", "math"],
      createdAt: new Date(),
      updatedAt: new Date(),
      hasTextToSpeech: true,
      hasHighContrastMode: true,
      hasKeyboardControls: true,
      minPlayTime: 5,
      maxPlayTime: 15,
      averageRating: 4.8,
      learningOutcomes: "Students will recognize and continue simple patterns",
      curriculumStandards: "Meets Common Core Math Standards 1.OA.D.8",
      accessibility: "Clear pattern visualization, step-by-step hints"
    },
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