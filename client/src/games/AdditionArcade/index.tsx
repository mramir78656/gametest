import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Star, Trophy, Volume2 } from 'lucide-react';

interface AdditionArcadeProps {
  onScoreUpdate?: (score: number) => void;
}

const AdditionArcade: React.FC<AdditionArcadeProps> = ({ onScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentProblem, setCurrentProblem] = useState({ num1: 0, num2: 0 });
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [stars, setStars] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    generateProblem();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Generate sound effects using Web Audio API
  const playSound = (type: 'correct' | 'incorrect' | 'star' | 'levelUp' | 'click') => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'correct':
        // Happy chime sound
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;
      
      case 'incorrect':
        // Gentle error sound
        oscillator.frequency.setValueAtTime(220, ctx.currentTime); // A3
        oscillator.frequency.setValueAtTime(196, ctx.currentTime + 0.2); // G3
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        break;

      case 'star':
        // Sparkling star sound
        oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
        oscillator.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.1); // C#6
        oscillator.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.2); // E6
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.6);
        break;

      case 'levelUp':
        // Victory fanfare
        const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        frequencies.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.2);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.2 + 0.4);
          osc.start(ctx.currentTime + index * 0.2);
          osc.stop(ctx.currentTime + index * 0.2 + 0.4);
        });
        break;

      case 'click':
        // Button click sound
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
    }
  };

  const generateProblem = () => {
    const maxNum = Math.min(5 + level * 2, 20);
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    setCurrentProblem({ num1, num2 });
    setAnswer('');
    setFeedback('');
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    playSound('click');
    const userAnswer = parseInt(answer);
    const correctAnswer = currentProblem.num1 + currentProblem.num2;
    
    if (userAnswer === correctAnswer) {
      playSound('correct');
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setIsCorrect(true);
      setFeedback('Great job! ⭐');
      
      if (newStreak % 3 === 0) {
        playSound('star');
        setStars(stars + 1);
      }
      
      if (newScore % 100 === 0) {
        playSound('levelUp');
        setLevel(level + 1);
        setFeedback('Level Up! Amazing work! 🏆');
      }
      
      onScoreUpdate?.(newScore);
      
      setTimeout(() => {
        generateProblem();
      }, 1500);
    } else {
      playSound('incorrect');
      setIsCorrect(false);
      setStreak(0);
      setFeedback(`Try again! The answer is ${correctAnswer}`);
      
      setTimeout(() => {
        generateProblem();
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-yellow-300 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Addition Arcade</h1>
            <Volume2 className="text-white w-6 h-6" />
          </div>
          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-300" />
              <span className="text-2xl font-bold">{stars}</span>
            </div>
            <div className="text-xl">Score: {score}</div>
            <div className="text-xl">Level: {level}</div>
          </div>
        </div>

        {/* Game Area */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-purple-600">
              Solve the Addition Problem!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Math Problem */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-xl">
              <div className="text-6xl font-bold text-purple-700 mb-4">
                {currentProblem.num1} + {currentProblem.num2} = ?
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
                  Check Answer
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

            {/* Streak Indicator */}
            {streak > 0 && (
              <div className="bg-yellow-100 p-4 rounded-lg">
                <div className="text-xl text-yellow-700">
                  🔥 Streak: {streak} correct in a row!
                </div>
              </div>
            )}

            {/* Encouragement */}
            <div className="text-lg text-gray-600">
              {score < 50 && "You're doing great! Keep solving problems!"}
              {score >= 50 && score < 100 && "Fantastic work! You're getting better!"}
              {score >= 100 && "You're an addition superstar! 🌟"}
            </div>
          </CardContent>
        </Card>

        {/* Visual Decorations */}
        <div className="mt-8 flex justify-center">
          {[...Array(Math.min(stars, 10))].map((_, i) => (
            <Star key={i} className="w-8 h-8 text-yellow-400 mx-1 animate-pulse" fill="currentColor" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdditionArcade;