import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Flower, Volume2, VolumeX } from 'lucide-react';

interface SpellingBeeGardenProps {
  onScoreUpdate?: (score: number) => void;
}

const SpellingBeeGarden: React.FC<SpellingBeeGardenProps> = ({ onScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentWord, setCurrentWord] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [flowersGrown, setFlowersGrown] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentWordRef = useRef('');
  
  const words = [
    // Level 1 - Simple 3-letter words
    { word: 'cat', level: 1, hint: 'A furry pet that says meow' },
    { word: 'dog', level: 1, hint: 'A loyal pet that barks' },
    { word: 'sun', level: 1, hint: 'The bright star in the sky' },
    { word: 'run', level: 1, hint: 'Move very fast with your legs' },
    { word: 'hop', level: 1, hint: 'Jump like a bunny' },
    
    // Level 2 - 4-letter words
    { word: 'tree', level: 2, hint: 'Tall plant with leaves and bark' },
    { word: 'bird', level: 2, hint: 'Animal that flies and has feathers' },
    { word: 'fish', level: 2, hint: 'Animal that swims in water' },
    { word: 'book', level: 2, hint: 'You read this for stories' },
    { word: 'cake', level: 2, hint: 'Sweet dessert for birthdays' },
    
    // Level 3 - 5-letter words
    { word: 'happy', level: 3, hint: 'Feeling joyful and glad' },
    { word: 'house', level: 3, hint: 'Building where people live' },
    { word: 'green', level: 3, hint: 'Color of grass and leaves' },
    { word: 'water', level: 3, hint: 'Clear liquid we drink' },
    { word: 'smile', level: 3, hint: 'Happy expression on your face' },
  ];

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    generateWord();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = (type: 'correct' | 'incorrect' | 'flower' | 'bee' | 'click' | 'levelUp') => {
    if (!audioContextRef.current || !isSoundEnabled) return;

    const ctx = audioContextRef.current;
    
    switch (type) {
      case 'correct':
        // Happy bell sound
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
      
      case 'incorrect':
        // Gentle correction sound
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.setValueAtTime(220, ctx.currentTime);
        gain1.gain.setValueAtTime(0.2, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.3);
        break;

      case 'flower':
        // Magical flower growing sound
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
        osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.6);
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.8);
        break;

      case 'bee':
        // Bee buzzing sound
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.frequency.setValueAtTime(200, ctx.currentTime);
        osc3.frequency.setValueAtTime(250, ctx.currentTime + 0.1);
        osc3.frequency.setValueAtTime(200, ctx.currentTime + 0.2);
        gain3.gain.setValueAtTime(0.2, ctx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc3.start(ctx.currentTime);
        osc3.stop(ctx.currentTime + 0.3);
        break;

      case 'click':
        const osc4 = ctx.createOscillator();
        const gain4 = ctx.createGain();
        osc4.connect(gain4);
        gain4.connect(ctx.destination);
        osc4.frequency.setValueAtTime(800, ctx.currentTime);
        gain4.gain.setValueAtTime(0.1, ctx.currentTime);
        gain4.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc4.start(ctx.currentTime);
        osc4.stop(ctx.currentTime + 0.1);
        break;

      case 'levelUp':
        // Magical level up sound
        [261.63, 329.63, 392.00, 523.25, 659.25].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.15 + 0.5);
          osc.start(ctx.currentTime + index * 0.15);
          osc.stop(ctx.currentTime + index * 0.15 + 0.5);
        });
        break;
    }
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window && isSoundEnabled) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const generateWord = () => {
    const levelWords = words.filter(w => w.level <= level);
    const randomWord = levelWords[Math.floor(Math.random() * levelWords.length)];
    setCurrentWord(randomWord.word);
    currentWordRef.current = randomWord.word;
    setAnswer('');
    setFeedback('');
    setIsCorrect(null);
    
    // Automatically speak the word
    setTimeout(() => speakWord(randomWord.word), 500);
  };

  const checkSpelling = () => {
    playSound('click');
    const userAnswer = answer.toLowerCase().trim();
    const correctWord = currentWord.toLowerCase();
    
    if (userAnswer === correctWord) {
      playSound('correct');
      setTimeout(() => playSound('flower'), 400);
      setTimeout(() => playSound('bee'), 800);
      
      const newScore = score + (currentWord.length * 5);
      const newStreak = streak + 1;
      const newFlowers = flowersGrown + 1;
      
      setScore(newScore);
      setStreak(newStreak);
      setFlowersGrown(newFlowers);
      setIsCorrect(true);
      setFeedback(`Perfect! You grew a beautiful flower! 🌸`);
      
      if (newFlowers % 5 === 0 && level < 3) {
        setTimeout(() => playSound('levelUp'), 1200);
        setLevel(level + 1);
        setFeedback(`Garden Level Up! You're becoming a spelling expert! 🌻`);
      }
      
      onScoreUpdate?.(newScore);
      
      setTimeout(() => {
        generateWord();
      }, 2000);
    } else {
      playSound('incorrect');
      setIsCorrect(false);
      setStreak(0);
      setFeedback(`Almost there! The correct spelling is "${currentWord}". Try the next word!`);
      
      setTimeout(() => {
        generateWord();
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkSpelling();
    }
  };

  const repeatWord = () => {
    playSound('click');
    speakWord(currentWord);
  };

  const getCurrentWordInfo = () => {
    return words.find(w => w.word === currentWord);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-green-200 to-yellow-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-green-800 drop-shadow-lg">Spelling Bee Garden</h1>
            <button 
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="text-green-800"
            >
              {isSoundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          </div>
          <div className="flex items-center gap-6 text-green-800">
            <div className="flex items-center gap-2">
              <Flower className="w-6 h-6 text-pink-500" />
              <span className="text-2xl font-bold">{flowersGrown}</span>
            </div>
            <div className="text-xl">Score: {score}</div>
            <div className="text-xl">Garden Level: {level}</div>
          </div>
        </div>

        {/* Game Area */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-green-600">
              Listen and Spell the Word! 🐝
            </CardTitle>
            <p className="text-lg text-gray-600">Spell correctly to grow beautiful flowers</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Word Audio Section */}
            <div className="bg-gradient-to-r from-yellow-100 to-green-100 p-8 rounded-xl border-4 border-yellow-300">
              <div className="text-lg text-green-700 mb-4">
                🐝 Listen carefully and spell the word! 🌻
              </div>
              
              <Button
                onClick={repeatWord}
                className="text-2xl px-8 py-6 bg-yellow-400 hover:bg-yellow-500 text-green-800 mb-6"
              >
                🔊 Hear Word Again
              </Button>
              
              {getCurrentWordInfo() && (
                <div className="text-md text-gray-600 mb-4 italic">
                  Hint: {getCurrentWordInfo()?.hint}
                </div>
              )}
              
              {/* Spelling Input */}
              <div className="flex justify-center gap-4">
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-3xl text-center w-64 h-16"
                  placeholder="Type the word here..."
                  autoFocus
                />
                <Button
                  onClick={checkSpelling}
                  className="text-xl px-8 h-16 bg-green-500 hover:bg-green-600"
                  disabled={!answer}
                >
                  Plant Flower
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
                  🔥 Spelling Streak: {streak} words in a row!
                </div>
              </div>
            )}

            {/* Garden Progress */}
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-xl text-green-700">
                🌺 Flowers in Garden: {flowersGrown} | 🏆 Garden Level: {level}/3
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Spell 5 words correctly to advance your garden level!
              </div>
            </div>

            {/* Encouragement */}
            <div className="text-lg text-gray-600">
              {flowersGrown < 3 && "Great start! Keep spelling to grow your garden!"}
              {flowersGrown >= 3 && flowersGrown < 10 && "Your garden is blooming beautifully!"}
              {flowersGrown >= 10 && "Amazing spelling bee! Your garden is magnificent! 🌟"}
            </div>
          </CardContent>
        </Card>

        {/* Flower Garden Display */}
        <div className="mt-8 bg-white/80 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-center text-green-700 mb-4">Your Flower Garden</h3>
          <div className="flex justify-center flex-wrap gap-3">
            {[...Array(Math.min(flowersGrown, 25))].map((_, i) => {
              const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼'];
              const flower = flowers[i % flowers.length];
              return (
                <div 
                  key={i} 
                  className="text-4xl animate-bounce"
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '2s'
                  }}
                >
                  {flower}
                </div>
              );
            })}
          </div>
          {flowersGrown === 0 && (
            <div className="text-center text-gray-500 text-lg">
              🌱 Your garden is ready for flowers! Start spelling to plant them! 🌱
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpellingBeeGarden;