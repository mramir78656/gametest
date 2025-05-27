import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

const SubtractionSafari = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [problem, setProblem] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [animals, setAnimals] = useState(0);
  const { user } = useUser();

  const animalEmojis = ['🦁', '🐘', '🦒', '🐯', '🦓', '🐵', '🦏', '🦘'];

  const generateProblem = () => {
    // Simple subtraction for 1st grade (result always positive)
    const num1 = Math.floor(Math.random() * 10) + 5; // 5-14
    const num2 = Math.floor(Math.random() * num1); // 0 to num1
    const answer = num1 - num2;
    
    setProblem({ num1, num2, answer });
    setUserAnswer('');
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    const answer = parseInt(userAnswer);
    if (answer === problem.answer) {
      setFeedback('🎉 Great job, Safari Explorer!');
      setScore(score + 15);
      setAnimals(animals + 1);
      
      if (animals + 1 >= 8) {
        setLevel(level + 1);
        setAnimals(0);
      }
      
      setTimeout(() => {
        generateProblem();
      }, 1500);
    } else {
      setFeedback('🌴 Keep exploring! Try again!');
    }
    setShowFeedback(true);
  };

  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
    generateProblem();
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setAnimals(0);
    setGameStarted(false);
    setShowInstructions(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-yellow-200 to-orange-200 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🦁 Subtraction Safari</h1>
          <div className="flex justify-center items-center space-x-6 bg-white rounded-full p-4 shadow-lg">
            <div className="text-lg font-bold text-green-600">Score: {score}</div>
            <div className="text-lg font-bold text-orange-600">Safari Level: {level}</div>
            <div className="text-lg font-bold text-yellow-600">
              Animals Found: {animalEmojis.slice(0, animals).join('')} ({animals}/8)
            </div>
          </div>
        </div>

        {/* Instructions */}
        {showInstructions && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">🌍 How to Play Safari</h2>
            <div className="text-lg text-gray-700 space-y-2">
              <p>🔢 Solve subtraction problems to find safari animals!</p>
              <p>🦁 Find 8 animals to complete your safari!</p>
              <p>🎯 Type your answer and click Explore!</p>
            </div>
            <button 
              onClick={startGame}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all transform hover:scale-105"
            >
              🚙 Start Safari!
            </button>
          </div>
        )}

        {/* Game Area */}
        {gameStarted && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="mb-4">
              <div className="text-2xl mb-4">🌴 Safari Math Challenge 🌴</div>
              <div className="text-6xl font-bold text-green-700 mb-6">
                {problem.num1} - {problem.num2} = ?
              </div>
            </div>
            
            <div className="mb-6">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-4xl text-center border-4 border-green-300 rounded-xl p-4 w-32 focus:border-green-500 focus:outline-none"
                placeholder="?"
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              />
            </div>

            <button
              onClick={checkAnswer}
              disabled={!userAnswer}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-full text-xl transition-all transform hover:scale-105 mb-4"
            >
              🔍 Explore Safari!
            </button>

            {/* Visual representation */}
            <div className="mb-6">
              <div className="text-lg mb-2">Count the animals:</div>
              <div className="flex justify-center space-x-2 mb-2">
                {Array(problem.num1).fill('🦁').map((animal, i) => (
                  <span key={i} className="text-2xl">{animal}</span>
                ))}
              </div>
              <div className="text-lg">
                Take away {problem.num2} animals - How many are left?
              </div>
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-xl text-xl font-bold ${
                feedback.includes('Great') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {feedback}
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={resetGame}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-all"
              >
                🔄 New Safari
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtractionSafari;