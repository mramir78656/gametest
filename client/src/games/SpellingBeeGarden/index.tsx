import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

const SpellingBeeGarden = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentWord, setCurrentWord] = useState('');
  const [userSpelling, setUserSpelling] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [flowers, setFlowers] = useState(0);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { user } = useUser();

  // Simple 1st grade words
  const words = [
    'cat', 'dog', 'run', 'sun', 'fun', 'big', 'red', 'hat', 'bat', 'sit',
    'top', 'hop', 'map', 'cup', 'yes', 'fox', 'box', 'six', 'mix', 'fix',
    'pen', 'hen', 'ten', 'web', 'bed', 'leg', 'egg', 'bag', 'tag', 'wag'
  ];

  const generateWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setUserSpelling('');
    setShowFeedback(false);
  };

  const speakWord = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('Google')) || speechSynthesis.getVoices()[0];
      speechSynthesis.speak(utterance);
    }
  };

  const checkSpelling = () => {
    if (userSpelling.toLowerCase() === currentWord.toLowerCase()) {
      setFeedback('🌸 Perfect spelling! You grew a flower!');
      setScore(score + 20);
      setFlowers(flowers + 1);
      
      if (flowers + 1 >= 10) {
        setLevel(level + 1);
        setFlowers(0);
      }
      
      setTimeout(() => {
        generateWord();
      }, 2000);
    } else {
      setFeedback('🐝 Buzz! Try again, little bee!');
    }
    setShowFeedback(true);
  };

  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
    generateWord();
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setFlowers(0);
    setGameStarted(false);
    setShowInstructions(true);
  };

  useEffect(() => {
    if (gameStarted && currentWord) {
      // Auto-speak the word when it changes
      setTimeout(() => speakWord(), 500);
    }
  }, [currentWord, gameStarted]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-purple-200 to-yellow-200 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">🐝 Spelling Bee Garden</h1>
          <div className="flex justify-center items-center space-x-6 bg-white rounded-full p-4 shadow-lg">
            <div className="text-lg font-bold text-purple-600">Score: {score}</div>
            <div className="text-lg font-bold text-pink-600">Garden Level: {level}</div>
            <div className="text-lg font-bold text-yellow-600">
              Flowers: {'🌸'.repeat(flowers)} ({flowers}/10)
            </div>
          </div>
        </div>

        {/* Instructions */}
        {showInstructions && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6 text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">🌻 How to Play Garden Spelling</h2>
            <div className="text-lg text-gray-700 space-y-2">
              <p>🐝 Listen to the word and spell it correctly!</p>
              <p>🌸 Grow 10 flowers to complete your garden!</p>
              <p>🔊 Click the sound button to hear the word again!</p>
            </div>
            <button 
              onClick={startGame}
              className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all transform hover:scale-105"
            >
              🌱 Start Gardening!
            </button>
          </div>
        )}

        {/* Game Area */}
        {gameStarted && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="mb-6">
              <div className="text-2xl mb-4">🌻 Listen and Spell! 🌻</div>
              <button
                onClick={speakWord}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-full text-2xl transition-all transform hover:scale-105 mb-6"
              >
                🔊 Hear Word
              </button>
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                value={userSpelling}
                onChange={(e) => setUserSpelling(e.target.value)}
                className="text-3xl text-center border-4 border-pink-300 rounded-xl p-4 w-64 focus:border-pink-500 focus:outline-none lowercase"
                placeholder="spell here..."
                onKeyPress={(e) => e.key === 'Enter' && checkSpelling()}
              />
            </div>

            <button
              onClick={checkSpelling}
              disabled={!userSpelling}
              className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-full text-xl transition-all transform hover:scale-105 mb-6"
            >
              🌸 Plant Flower!
            </button>

            {/* Visual garden */}
            <div className="mb-6 p-4 bg-green-100 rounded-xl">
              <div className="text-lg mb-2">🌱 Your Beautiful Garden:</div>
              <div className="flex justify-center flex-wrap">
                {Array(flowers).fill('🌸').map((flower, i) => (
                  <span key={i} className="text-3xl m-1 animate-pulse">{flower}</span>
                ))}
                {Array(10 - flowers).fill('🌱').map((seed, i) => (
                  <span key={i} className="text-2xl m-1 opacity-50">{seed}</span>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-xl text-xl font-bold ${
                feedback.includes('Perfect') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {feedback}
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={resetGame}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-all"
              >
                🔄 New Garden
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellingBeeGarden;