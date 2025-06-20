import { Router, type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserProgressSchema } from "@shared/schema";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();
  
  // Health check
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  // Grades routes
  apiRouter.get("/grades", async (req, res) => {
    const grades = await storage.getGrades();
    res.json(grades);
  });
  
  apiRouter.get("/grades/:slug", async (req, res) => {
    const grade = await storage.getGradeBySlug(req.params.slug);
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.json(grade);
  });
  
  // Subjects routes
  apiRouter.get("/subjects", async (req, res) => {
    const subjects = await storage.getSubjects();
    res.json(subjects);
  });
  
  // Games routes
  apiRouter.get("/games", async (req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });
  
  apiRouter.get("/games/featured", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const featured = await storage.getFeaturedGames(limit);
    res.json(featured);
  });
  
  apiRouter.get("/games/:slug", async (req, res) => {
    const game = await storage.getGameBySlug(req.params.slug);
    
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    const subjects = await storage.getGameSubjects(game.id);
    
    res.json({
      ...game,
      subjects
    });
  });
  
  apiRouter.get("/games/by-grade/:gradeId", async (req, res) => {
    const gradeId = parseInt(req.params.gradeId);
    
    if (isNaN(gradeId)) {
      return res.status(400).json({ message: "Invalid grade ID" });
    }
    
    const games = await storage.getGamesByGradeId(gradeId);
    
    // Add subject information to each game
    const gamesWithSubjects = await Promise.all(
      games.map(async (game) => {
        const subjects = await storage.getGameSubjects(game.id);
        return {
          ...game,
          subjects
        };
      })
    );
    
    res.json(gamesWithSubjects);
  });
  
  // User progress routes
  apiRouter.get("/user-progress/:userId/:gameId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const gameId = parseInt(req.params.gameId);
    
    if (isNaN(userId) || isNaN(gameId)) {
      return res.status(400).json({ message: "Invalid user ID or game ID" });
    }
    
    const progress = await storage.getUserProgress(userId, gameId);
    
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }
    
    res.json(progress);
  });
  
  apiRouter.get("/user-progress/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const progress = await storage.getAllUserProgress(userId);
    res.json(progress);
  });
  
  apiRouter.post("/user-progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.updateUserProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  
  // User badges routes
  apiRouter.get("/user-badges/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const badges = await storage.getUserBadges(userId);
    res.json(badges);
  });

  // Classroom Tools & Resources routes
  apiRouter.get("/classroom-resources", async (req, res) => {
    const { subject, grade, type } = req.query;
    
    // Comprehensive teacher resources
    const resources = [
      {
        id: 1,
        title: "Math Addition Worksheets - Single Digits",
        type: "worksheet",
        subject: "math",
        grade: "grade-1",
        description: "Practice worksheets for single-digit addition with visual aids and step-by-step examples.",
        fileFormat: "PDF",
        downloadUrl: "/api/download-resource/math-addition-grade1",
        previewImage: "/api/resource-preview/math-addition-grade1",
        tags: ["addition", "basic-math", "visual-learning"],
        dateAdded: "2024-01-15",
        pages: 5,
        difficulty: "beginner"
      },
      {
        id: 2,
        title: "Phonics Sound Charts",
        type: "poster",
        subject: "english",
        grade: "prek",
        description: "Colorful phonics charts showing letter sounds with pictures and examples for classroom display.",
        fileFormat: "PDF",
        downloadUrl: "/api/download-resource/phonics-charts-prek",
        previewImage: "/api/resource-preview/phonics-charts-prek",
        tags: ["phonics", "alphabet", "reading-readiness"],
        dateAdded: "2024-01-12",
        pages: 3,
        difficulty: "beginner"
      },
      {
        id: 3,
        title: "Science Lab Safety Rules Poster",
        type: "poster",
        subject: "science",
        grade: "grade-3",
        description: "Essential laboratory safety rules and procedures for elementary science experiments.",
        fileFormat: "PDF",
        downloadUrl: "/api/download-resource/science-safety-grade3",
        previewImage: "/api/resource-preview/science-safety-grade3",
        tags: ["safety", "laboratory", "experiments"],
        dateAdded: "2024-01-10",
        pages: 2,
        difficulty: "intermediate"
      },
      {
        id: 4,
        title: "Multiplication Tables Practice Cards",
        type: "flashcards",
        subject: "math",
        grade: "grade-3",
        description: "Printable multiplication flashcards for tables 1-12 with answers on the back.",
        fileFormat: "PDF",
        downloadUrl: "/api/download-resource/multiplication-cards-grade3",
        previewImage: "/api/resource-preview/multiplication-cards-grade3",
        tags: ["multiplication", "memorization", "practice"],
        dateAdded: "2024-01-08",
        pages: 12,
        difficulty: "intermediate"
      },
      {
        id: 5,
        title: "Reading Comprehension Questions Template",
        type: "template",
        subject: "english",
        grade: "grade-2",
        description: "Structured template for creating reading comprehension questions for any story or text.",
        fileFormat: "PDF",
        downloadUrl: "/api/download-resource/reading-template-grade2",
        previewImage: "/api/resource-preview/reading-template-grade2",
        tags: ["comprehension", "questions", "template"],
        dateAdded: "2024-01-05",
        pages: 4,
        difficulty: "beginner"
      },
      {
        id: 6,
        title: "Subtraction Safari Worksheets",
        type: "worksheet",
        subject: "math",
        grade: "grade-1",
        description: "Animal-themed subtraction worksheets with visual counting aids and word problems.",
        fileFormat: "PDF",
        downloadUrl: "/api/download-resource/subtraction-safari-grade1",
        previewImage: "/api/resource-preview/subtraction-safari-grade1",
        tags: ["subtraction", "animals", "word-problems"],
        dateAdded: "2024-01-20",
        pages: 6,
        difficulty: "beginner"
      },
      {
        id: 7,
        title: "Sight Words Memory Game Cards",
        type: "flashcards",
        subject: "english",
        grade: "grade-1",
        description: "Printable sight word cards for memory games and recognition practice.",
        fileFormat: "PDF",
        downloadUrl: "/api/download-resource/sight-words-memory-grade1",
        previewImage: "/api/resource-preview/sight-words-memory-grade1",
        tags: ["sight-words", "memory", "recognition"],
        dateAdded: "2024-01-18",
        pages: 8,
        difficulty: "beginner"
      },
      {
        id: 8,
        title: "Spelling Bee Practice Lists",
        type: "worksheet",
        subject: "english",
        grade: "grade-2",
        description: "Weekly spelling lists with practice activities and pronunciation guides.",
        fileFormat: "PDF",
        downloadUrl: "/api/download-resource/spelling-practice-grade2",
        previewImage: "/api/resource-preview/spelling-practice-grade2",
        tags: ["spelling", "vocabulary", "practice"],
        dateAdded: "2024-01-16",
        pages: 10,
        difficulty: "intermediate"
      }
    ];

    // Filter resources based on query parameters
    let filteredResources = resources;
    
    if (subject && subject !== 'all') {
      filteredResources = filteredResources.filter(r => r.subject === subject);
    }
    
    if (grade && grade !== 'all') {
      filteredResources = filteredResources.filter(r => r.grade === grade);
    }
    
    if (type && type !== 'all') {
      filteredResources = filteredResources.filter(r => r.type === type);
    }

    res.json(filteredResources);
  });

  // PDF Download route
  apiRouter.get("/download-resource/:resourceId", async (req, res) => {
    const { resourceId } = req.params;
    
    try {
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resourceId}.pdf"`);
      
      // Create PDF based on resource type
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      doc.pipe(res);
      
      // Generate PDF content based on resource ID
      switch (resourceId) {
        case 'math-addition-grade1':
          generateMathAdditionWorksheet(doc);
          break;
        case 'phonics-charts-prek':
          generatePhonicsChart(doc);
          break;
        case 'science-safety-grade3':
          generateScienceSafetyPoster(doc);
          break;
        case 'multiplication-cards-grade3':
          generateMultiplicationCards(doc);
          break;
        case 'reading-template-grade2':
          generateReadingTemplate(doc);
          break;
        case 'subtraction-safari-grade1':
          generateSubtractionWorksheet(doc);
          break;
        case 'sight-words-memory-grade1':
          generateSightWordsCards(doc);
          break;
        case 'spelling-practice-grade2':
          generateSpellingWorksheet(doc);
          break;
        default:
          generateDefaultWorksheet(doc, resourceId);
          break;
      }
      
      doc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ message: 'Failed to generate PDF' });
    }
  });

  // Resource preview route
  apiRouter.get("/resource-preview/:resourceId", (req, res) => {
    // Generate simple preview placeholder
    res.setHeader('Content-Type', 'image/svg+xml');
    const { resourceId } = req.params;
    
    const svg = `
      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="400" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
        <text x="150" y="50" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">Preview</text>
        <text x="150" y="200" text-anchor="middle" font-family="Arial" font-size="12">${resourceId}</text>
        <text x="150" y="350" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">PDF Resource</text>
      </svg>
    `;
    
    res.send(svg);
  });

  // Custom resource generation route
  apiRouter.post("/generate-custom-resource", async (req, res) => {
    try {
      const { title, subject, grade, type, content, customizations } = req.body;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="custom-${title.toLowerCase().replace(/\s+/g, '-')}.pdf"`);
      
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      doc.pipe(res);
      
      // Generate custom PDF based on parameters
      generateCustomResource(doc, { title, subject, grade, type, content, customizations });
      
      doc.end();
    } catch (error) {
      console.error('Custom PDF generation error:', error);
      res.status(500).json({ message: 'Failed to generate custom PDF' });
    }
  });
  
  // Mount the API routes under /api
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  
  return httpServer;
}

// PDF Generation Functions
function generateMathAdditionWorksheet(doc: PDFKit.PDFDocument) {
  doc.fontSize(20).text('Math Addition Worksheets - Grade 1', 50, 50);
  doc.fontSize(14).text('Name: _____________________ Date: _____________', 50, 80);
  
  const problems = [
    { a: 2, b: 3 }, { a: 1, b: 4 }, { a: 3, b: 2 }, { a: 5, b: 1 },
    { a: 4, b: 3 }, { a: 2, b: 5 }, { a: 6, b: 2 }, { a: 3, b: 4 },
    { a: 1, b: 7 }, { a: 4, b: 4 }, { a: 5, b: 3 }, { a: 2, b: 6 }
  ];
  
  let y = 120;
  problems.forEach((problem, index) => {
    if (index % 3 === 0 && index > 0) y += 60;
    const x = 50 + (index % 3) * 150;
    
    doc.fontSize(16)
       .text(`${problem.a} + ${problem.b} = ___`, x, y);
    
    // Add visual dots for younger students
    doc.fontSize(12);
    let dotX = x;
    for (let i = 0; i < problem.a; i++) {
      doc.circle(dotX, y + 25, 3).fill();
      dotX += 10;
    }
    dotX += 15;
    for (let i = 0; i < problem.b; i++) {
      doc.circle(dotX, y + 25, 3).fill();
      dotX += 10;
    }
  });
  
  doc.addPage();
  doc.fontSize(16).text('Answer Key', 50, 50);
  y = 80;
  problems.forEach((problem, index) => {
    if (index % 3 === 0 && index > 0) y += 40;
    const x = 50 + (index % 3) * 150;
    doc.text(`${problem.a} + ${problem.b} = ${problem.a + problem.b}`, x, y);
  });
}

function generatePhonicsChart(doc: PDFKit.PDFDocument) {
  doc.fontSize(24).text('Phonics Sound Chart - PreK', 50, 50);
  
  const phonics = [
    { letter: 'A', sound: '/a/', word: 'Apple', color: '#FF6B6B' },
    { letter: 'B', sound: '/b/', word: 'Ball', color: '#4ECDC4' },
    { letter: 'C', sound: '/k/', word: 'Cat', color: '#45B7D1' },
    { letter: 'D', sound: '/d/', word: 'Dog', color: '#FFA07A' },
    { letter: 'E', sound: '/e/', word: 'Egg', color: '#98D8C8' },
    { letter: 'F', sound: '/f/', word: 'Fish', color: '#F7DC6F' }
  ];
  
  let y = 100;
  phonics.forEach((item, index) => {
    if (index % 2 === 0 && index > 0) y += 100;
    const x = 50 + (index % 2) * 250;
    
    doc.fontSize(48).fillColor(item.color).text(item.letter, x, y);
    doc.fontSize(16).fillColor('black').text(`Sound: ${item.sound}`, x + 80, y + 10);
    doc.fontSize(14).text(`Word: ${item.word}`, x + 80, y + 35);
    
    // Draw a box around each letter
    doc.rect(x - 10, y - 10, 60, 60).stroke();
  });
}

function generateScienceSafetyPoster(doc: PDFKit.PDFDocument) {
  doc.fontSize(24).text('Science Lab Safety Rules', 50, 50);
  doc.fontSize(16).text('Grade 3 - Important Guidelines', 50, 80);
  
  const safetyRules = [
    'Always wash your hands before and after experiments',
    'Wear safety goggles when instructed',
    'Never taste or smell unknown substances',
    'Keep your workspace clean and organized',
    'Listen carefully to all instructions',
    'Report any accidents to your teacher immediately',
    'Handle all materials gently and carefully',
    'Work quietly and focus on your experiment'
  ];
  
  let y = 120;
  safetyRules.forEach((rule, index) => {
    doc.fontSize(14)
       .text(`${index + 1}. ${rule}`, 50, y);
    y += 40;
  });
  
  // Add warning symbols
  doc.fontSize(30).fillColor('red').text('⚠️', 450, 150);
  doc.fontSize(30).fillColor('blue').text('🥽', 450, 200);
  doc.fontSize(30).fillColor('green').text('🧤', 450, 250);
}

function generateMultiplicationCards(doc: PDFKit.PDFDocument) {
  doc.fontSize(20).text('Multiplication Flash Cards - Grade 3', 50, 50);
  doc.fontSize(12).text('Cut along dotted lines to create individual cards', 50, 75);
  
  for (let table = 1; table <= 12; table++) {
    if (table > 1) doc.addPage();
    
    doc.fontSize(18).text(`${table} Times Table`, 50, 50);
    
    let y = 100;
    for (let i = 1; i <= 12; i++) {
      if (i % 3 === 1 && i > 1) y += 120;
      const x = 50 + ((i - 1) % 3) * 160;
      
      // Front of card (problem)
      doc.rect(x, y, 140, 80).stroke();
      doc.fontSize(16).text(`${table} × ${i}`, x + 50, y + 30);
      
      // Back of card (answer) - shown below
      doc.rect(x, y + 90, 140, 80).stroke();
      doc.fontSize(14).text(`${table} × ${i} = ${table * i}`, x + 30, y + 120);
    }
  }
}

function generateReadingTemplate(doc: PDFKit.PDFDocument) {
  doc.fontSize(20).text('Reading Comprehension Template - Grade 2', 50, 50);
  doc.fontSize(14).text('Story Title: _________________________________', 50, 80);
  doc.fontSize(14).text('Author: ______________________ Date: __________', 50, 110);
  
  const sections = [
    'Main Character(s):',
    'Setting (Where and When):',
    'Problem in the Story:',
    'How was the problem solved?',
    'What was your favorite part?',
    'What would you change about the story?'
  ];
  
  let y = 150;
  sections.forEach((section) => {
    doc.fontSize(14).text(section, 50, y);
    y += 30;
    // Add lines for writing
    for (let i = 0; i < 3; i++) {
      doc.moveTo(50, y).lineTo(500, y).stroke();
      y += 20;
    }
    y += 10;
  });
}

function generateSubtractionWorksheet(doc: PDFKit.PDFDocument) {
  doc.fontSize(20).text('Subtraction Safari - Grade 1', 50, 50);
  doc.fontSize(14).text('Help the animals solve subtraction problems!', 50, 80);
  doc.fontSize(14).text('Name: _____________________ Date: _____________', 50, 110);
  
  const problems = [
    { minuend: 8, subtrahend: 3, animal: '🦁' },
    { minuend: 7, subtrahend: 2, animal: '🐘' },
    { minuend: 9, subtrahend: 4, animal: '🦒' },
    { minuend: 6, subtrahend: 1, animal: '🦓' },
    { minuend: 10, subtrahend: 5, animal: '🐵' },
    { minuend: 8, subtrahend: 6, animal: '🦛' }
  ];
  
  let y = 150;
  problems.forEach((problem, index) => {
    if (index % 2 === 0 && index > 0) y += 80;
    const x = 50 + (index % 2) * 250;
    
    doc.fontSize(16).text(`${problem.animal} ${problem.minuend} - ${problem.subtrahend} = ___`, x, y);
    doc.fontSize(12).text(`There were ${problem.minuend} animals.`, x, y + 25);
    doc.fontSize(12).text(`${problem.subtrahend} walked away.`, x, y + 40);
    doc.fontSize(12).text('How many are left? ___', x, y + 55);
  });
}

function generateSightWordsCards(doc: PDFKit.PDFDocument) {
  doc.fontSize(20).text('Sight Word Memory Cards - Grade 1', 50, 50);
  
  const sightWords = [
    'the', 'and', 'a', 'to', 'said', 'you', 'he', 'it', 'his', 'her',
    'was', 'one', 'all', 'were', 'they', 'we', 'when', 'your', 'can', 'had'
  ];
  
  let y = 100;
  sightWords.forEach((word, index) => {
    if (index % 4 === 0 && index > 0) y += 120;
    const x = 50 + (index % 4) * 120;
    
    // Create card border
    doc.rect(x, y, 100, 80).stroke();
    doc.fontSize(18).text(word, x + 30, y + 30);
  });
}

function generateSpellingWorksheet(doc: PDFKit.PDFDocument) {
  doc.fontSize(20).text('Spelling Practice - Grade 2', 50, 50);
  doc.fontSize(14).text('Week 1 Word List', 50, 80);
  doc.fontSize(14).text('Name: _____________________ Date: _____________', 50, 110);
  
  const words = [
    'apple', 'butterfly', 'elephant', 'garden', 'happy',
    'island', 'jungle', 'kitten', 'lemon', 'mountain'
  ];
  
  doc.fontSize(16).text('Practice Words:', 50, 150);
  let y = 180;
  words.forEach((word, index) => {
    doc.fontSize(14).text(`${index + 1}. ${word}`, 50, y);
    doc.text('_________________', 150, y);
    y += 30;
  });
  
  doc.addPage();
  doc.fontSize(16).text('Spelling Test Practice', 50, 50);
  y = 80;
  words.forEach((word, index) => {
    doc.fontSize(14).text(`${index + 1}. ________________`, 50, y);
    y += 40;
  });
}

function generateDefaultWorksheet(doc: PDFKit.PDFDocument, resourceId: string) {
  doc.fontSize(20).text('Educational Resource', 50, 50);
  doc.fontSize(16).text(`Resource ID: ${resourceId}`, 50, 80);
  doc.fontSize(14).text('This is a generated educational resource.', 50, 120);
  doc.fontSize(12).text('Content customized for classroom use.', 50, 150);
}

function generateCustomResource(doc: PDFKit.PDFDocument, params: any) {
  const { title, subject, grade, type, content, customizations } = params;
  
  doc.fontSize(20).text(title || 'Custom Educational Resource', 50, 50);
  doc.fontSize(14).text(`Subject: ${subject} | Grade: ${grade} | Type: ${type}`, 50, 80);
  
  if (content) {
    doc.fontSize(12).text(content, 50, 120, { width: 500 });
  }
  
  if (customizations) {
    let y = 200;
    Object.entries(customizations).forEach(([key, value]) => {
      doc.fontSize(10).text(`${key}: ${value}`, 50, y);
      y += 20;
    });
  }
}
