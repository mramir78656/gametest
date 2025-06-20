import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface SightWordMemoryProps {
  onScoreUpdate?: (score: number) => void;
}

interface GameCard {
  id: number;
  word: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SightWordMemory: React.FC<SightWordMemoryProps> = ({ onScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const sightWords = [
    // Level 1 - Basic sight words
    { words: ['the', 'and', 'a', 'to', 'said', 'you'], level: 1 },
    // Level 2 - More sight words
    { words: ['he', 'it', 'his', 'her', 'was', 'one'], level: 2 },
    // Level 3 - Advanced sight words
    { words: ['all', 'were', 'they', 'we', 'when', 'your'], level: 3 },
  ];

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    initializeGame();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [level]);

  const playSound = (type: 'flip' | 'match' | 'mismatch' | 'win' | 'click' | 'levelUp') => {
    if (!audioContextRef.current || !isSoundEnabled) return;

    const ctx = audioContextRef.current;
    
    switch (type) {
      case 'flip':
        // Card flip sound
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.setValueAtTime(400, ctx.currentTime);
        osc1.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        gain1.gain.setValueAtTime(0.2, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.2);
        break;
      
      case 'match':
        // Success match sound
        [523.25, 659.25, 783.99].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.3);
          osc.start(ctx.currentTime + index * 0.1);
          osc.stop(ctx.currentTime + index * 0.1 + 0.3);
        });
        break;

      case 'mismatch':
        // Gentle mismatch sound
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(200, ctx.currentTime);
        gain2.gain.setValueAtTime(0.15, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.3);
        break;

      case 'win':
        // Victory fanfare
        [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.2);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.2 + 0.5);
          osc.start(ctx.currentTime + index * 0.2);
          osc.stop(ctx.currentTime + index * 0.2 + 0.5);
        });
        break;

      case 'click':
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.frequency.setValueAtTime(800, ctx.currentTime);
        gain3.gain.setValueAtTime(0.1, ctx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc3.start(ctx.currentTime);
        osc3.stop(ctx.currentTime + 0.1);
        break;

      case 'levelUp':
        // Level up celebration
        [440, 554.37, 659.25, 880].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.15 + 0.4);
          osc.start(ctx.currentTime + index * 0.15);
          osc.stop(ctx.currentTime + index * 0.15 + 0.4);
        });
        break;
    }
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window && isSoundEnabled) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const initializeGame = () => {
    const currentWords = sightWords.find(sw => sw.level === level)?.words || sightWords[0].words;
    const gameWords = currentWords.slice(0, 6); // Use 6 words for 12 cards
    
    // Create pairs of cards
    const cardPairs: GameCard[] = [];
    gameWords.forEach((word, index) => {
      // Add two cards for each word
      cardPairs.push(
        { id: index * 2, word, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, word, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle the cards
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameWon(false);
    setFeedback('');
  };

  const handleCardClick = (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    playSound('flip');
    speakWord(card.word);
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // Update card state
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);
      
      setMoves(moves + 1);

      if (firstCard && secondCard && firstCard.word === secondCard.word) {
        // Match found!
        playSound('match');
        const newMatches = matches + 1;
        setMatches(newMatches);
        setFeedback(`Great match! "${firstCard.word}" ✨`);
        
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstCardId || c.id === secondCardId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedCards([]);
          
          // Check if game is won
          if (newMatches === 6) {
            playSound('win');
            const newScore = score + (100 - moves * 5);
            setScore(newScore);
            setGameWon(true);
            setFeedback(`Amazing! You found all pairs in ${moves + 1} moves! 🏆`);
            onScoreUpdate?.(newScore);
            
            if (level < 3) {
              setTimeout(() => {
                playSound('levelUp');
                setLevel(level + 1);
                setFeedback(`Level Up! Ready for more challenging sight words! 🌟`);
              }, 2000);
            }
          }
        }, 1000);
      } else {
        // No match
        playSound('mismatch');
        setFeedback('Try again! Remember where the words are!');
        
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstCardId || c.id === secondCardId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setFeedback('');
        }, 1500);
      }
    }
  };

  const resetGame = () => {
    playSound('click');
    initializeGame();
  };

  const nextLevel = () => {
    if (level < 3) {
      playSound('click');
      setLevel(level + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-purple-300 to-pink-300 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Sight Word Memory</h1>
            <button 
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="text-white"
            >
              {isSoundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          </div>
          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-yellow-300" />
              <span className="text-2xl font-bold">{matches}/6</span>
            </div>
            <div className="text-xl">Moves: {moves}</div>
            <div className="text-xl">Score: {score}</div>
            <div className="text-xl">Level: {level}</div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={resetGame}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            New Game
          </Button>
          {gameWon && level < 3 && (
            <Button
              onClick={nextLevel}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
            >
              Next Level
            </Button>
          )}
        </div>

        {/* Game Area */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-purple-600">
              Match the Sight Words! 👁️
            </CardTitle>
            <p className="text-lg text-gray-600">Find pairs of the same word</p>
          </CardHeader>
          <CardContent>
            {/* Memory Card Grid */}
            <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`
                    relative h-24 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105
                    ${card.isMatched ? 'bg-green-200 border-4 border-green-400' : 
                      card.isFlipped ? 'bg-blue-100 border-4 border-blue-400' : 
                      'bg-gradient-to-br from-purple-400 to-pink-400 border-4 border-purple-500'}
                  `}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {card.isFlipped || card.isMatched ? (
                      <span className="text-2xl font-bold text-gray-800">
                        {card.word}
                      </span>
                    ) : (
                      <div className="text-4xl">❓</div>
                    )}
                  </div>
                  
                  {card.isMatched && (
                    <div className="absolute top-1 right-1 text-green-600">
                      ✅
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`text-2xl font-bold p-4 rounded-lg text-center mb-4 ${
                gameWon ? 'bg-green-100 text-green-700' : 
                matches > 0 ? 'bg-blue-100 text-blue-700' : 
                'bg-orange-100 text-orange-700'
              }`}>
                {feedback}
              </div>
            )}

            {/* Game Stats */}
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <div className="text-lg text-purple-700">
                📊 Matches: {matches}/6 | 🎯 Moves: {moves} | ⭐ Level: {level}/3
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {!gameWon && "Click cards to flip them and find matching sight words!"}
                {gameWon && matches === 6 && "Excellent memory skills! You found all the pairs!"}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-yellow-100 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-800 mb-2">How to Play:</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Click on cards to flip them over and reveal sight words</li>
                <li>• Find two cards with the same word to make a match</li>
                <li>• Remember where words are located to improve your score</li>
                <li>• Complete all 6 matches to win and advance levels</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Progress Display */}
        <div className="mt-6 bg-white/80 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-center text-purple-700 mb-4">Memory Progress</h3>
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(matches / 6) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center mt-2 text-gray-600">
            {matches === 6 ? "Perfect! All pairs found!" : `${matches}/6 pairs matched`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SightWordMemory;