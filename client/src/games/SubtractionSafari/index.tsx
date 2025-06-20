import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, Binoculars, Volume2 } from 'lucide-react';

interface SubtractionSafariProps {
  onScoreUpdate?: (score: number) => void;
}

const SubtractionSafari: React.FC<SubtractionSafariProps> = ({ onScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentProblem, setCurrentProblem] = useState({ num1: 0, num2: 0 });
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [lives, setLives] = useState(3);
  const [animalsFound, setAnimalsFound] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentAnimal, setCurrentAnimal] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const animals = [
    { name: 'Lion', emoji: '🦁', sound: 'roar' },
    { name: 'Elephant', emoji: '🐘', sound: 'trumpet' },
    { name: 'Giraffe', emoji: '🦒', sound: 'gentle' },
    { name: 'Zebra', emoji: '🦓', sound: 'neigh' },
    { name: 'Monkey', emoji: '🐵', sound: 'chatter' },
    { name: 'Hippo', emoji: '🦛', sound: 'grunt' },
  ];

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    generateProblem();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = (type: 'correct' | 'incorrect' | 'animalSound' | 'discovery' | 'click') => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    switch (type) {
      case 'correct':
        // Safari success sound
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc1.frequency.setValueAtTime(554.37, ctx.currentTime + 0.2);
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.4);
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.6);
        break;
      
      case 'incorrect':
        // Gentle wrong sound
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(200, ctx.currentTime);
        gain2.gain.setValueAtTime(0.2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.3);
        break;

      case 'animalSound':
        // Different animal sounds based on current animal
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        
        if (currentAnimal.includes('Lion')) {
          // Deep roar
          osc3.frequency.setValueAtTime(100, ctx.currentTime);
          osc3.frequency.setValueAtTime(150, ctx.currentTime + 0.3);
        } else if (currentAnimal.includes('Elephant')) {
          // Trumpet sound
          osc3.frequency.setValueAtTime(200, ctx.currentTime);
          osc3.frequency.setValueAtTime(400, ctx.currentTime + 0.2);
          osc3.frequency.setValueAtTime(300, ctx.currentTime + 0.4);
        } else {
          // Generic animal sound
          osc3.frequency.setValueAtTime(300, ctx.currentTime);
          osc3.frequency.setValueAtTime(400, ctx.currentTime + 0.1);
        }
        
        gain3.gain.setValueAtTime(0.3, ctx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc3.start(ctx.currentTime);
        osc3.stop(ctx.currentTime + 0.6);
        break;

      case 'discovery':
        // Animal discovery fanfare
        [523.25, 659.25, 783.99].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.4);
          osc.start(ctx.currentTime + index * 0.1);
          osc.stop(ctx.currentTime + index * 0.1 + 0.4);
        });
        break;

      case 'click':
        const osc4 = ctx.createOscillator();
        const gain4 = ctx.createGain();
        osc4.connect(gain4);
        gain4.connect(ctx.destination);
        osc4.frequency.setValueAtTime(600, ctx.currentTime);
        gain4.gain.setValueAtTime(0.1, ctx.currentTime);
        gain4.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc4.start(ctx.currentTime);
        osc4.stop(ctx.currentTime + 0.1);
        break;
    }
  };

  const generateProblem = () => {
    const maxNum = Math.min(8 + level * 2, 20);
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const num1 = num2 + Math.floor(Math.random() * maxNum) + 1;
    setCurrentProblem({ num1, num2 });
    setAnswer('');
    setFeedback('');
    setIsCorrect(null);
    
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    setCurrentAnimal(randomAnimal.name + ' ' + randomAnimal.emoji);
  };

  const checkAnswer = () => {
    playSound('click');
    const userAnswer = parseInt(answer);
    const correctAnswer = currentProblem.num1 - currentProblem.num2;
    
    if (userAnswer === correctAnswer) {
      playSound('correct');
      setTimeout(() => playSound('animalSound'), 500);
      setTimeout(() => playSound('discovery'), 1000);
      
      const newScore = score + 15;
      const newAnimalsFound = animalsFound + 1;
      setScore(newScore);
      setAnimalsFound(newAnimalsFound);
      setIsCorrect(true);
      setFeedback(`Amazing! You found a ${currentAnimal}!`);
      
      if (newAnimalsFound % 5 === 0) {
        setLevel(level + 1);
        setFeedback(`Level Up! You're a Safari Expert! Found ${newAnimalsFound} animals!`);
      }
      
      onScoreUpdate?.(newScore);
      
      setTimeout(() => {
        generateProblem();
      }, 2500);
    } else {
      playSound('incorrect');
      setIsCorrect(false);
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback(`The animal ran away! The answer was ${correctAnswer}. Lives left: ${newLives}`);
      
      if (newLives === 0) {
        setFeedback(`Safari ended! You found ${animalsFound} animals. Great job exploring!`);
        setTimeout(() => {
          setLives(3);
          setScore(0);
          setAnimalsFound(0);
          setLevel(1);
          generateProblem();
        }, 3000);
      } else {
        setTimeout(() => {
          generateProblem();
        }, 2000);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 via-yellow-300 to-orange-300 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Subtraction Safari</h1>
            <Volume2 className="text-white w-6 h-6" />
          </div>
          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Binoculars className="w-6 h-6 text-yellow-300" />
              <span className="text-2xl font-bold">{animalsFound}</span>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`w-6 h-6 ${i < lives ? 'text-red-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <div className="text-xl">Score: {score}</div>
            <div className="text-xl">Level: {level}</div>
          </div>
        </div>

        {/* Game Area */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-green-600">
              Help Count the Animals!
            </CardTitle>
            <p className="text-lg text-gray-600">Solve subtraction to spot wildlife</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Safari Scene */}
            <div className="bg-gradient-to-r from-green-200 to-yellow-200 p-8 rounded-xl border-4 border-green-300">
              <div className="text-lg text-green-700 mb-4">
                🌿 Looking for: {currentAnimal} 🌿
              </div>
              
              {/* Math Problem */}
              <div className="text-6xl font-bold text-green-700 mb-4">
                {currentProblem.num1} - {currentProblem.num2} = ?
              </div>
              
              <div className="text-lg text-gray-600 mb-4">
                There were {currentProblem.num1} animals, {currentProblem.num2} walked away. How many are left?
              </div>
              
              {/* Answer Input */}
              <div className="flex justify-center gap-4">
                <Input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-3xl text-center w-32 h-16"
                  placeholder="?"
                  autoFocus
                />
                <Button
                  onClick={checkAnswer}
                  className="text-xl px-8 h-16 bg-green-500 hover:bg-green-600"
                  disabled={!answer}
                >
                  Spot Animal
                </Button>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`text-2xl font-bold p-4 rounded-lg ${
                isCorrect 
                  ? 'bg-green-100 text-green-700' 
                  : isCorrect === false 
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-blue-100 text-blue-700'
              }`}>
                {feedback}
              </div>
            )}

            {/* Progress Display */}
            <div className="bg-yellow-100 p-4 rounded-lg">
              <div className="text-xl text-yellow-700">
                🦁 Animals Found: {animalsFound} | 🏆 Safari Level: {level}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Find 5 animals to advance to the next safari level!
              </div>
            </div>

            {/* Encouragement */}
            <div className="text-lg text-gray-600">
              {animalsFound < 3 && "Great start, explorer! Keep looking for animals!"}
              {animalsFound >= 3 && animalsFound < 10 && "You're becoming a wildlife expert!"}
              {animalsFound >= 10 && "Amazing safari guide! You know your animals! 🌟"}
            </div>
          </CardContent>
        </Card>

        {/* Animal Collection Display */}
        <div className="mt-8 bg-white/80 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-center text-green-700 mb-4">Animals Spotted</h3>
          <div className="flex justify-center flex-wrap gap-2">
            {[...Array(Math.min(animalsFound, 20))].map((_, i) => (
              <div key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                {animals[i % animals.length].emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtractionSafari;