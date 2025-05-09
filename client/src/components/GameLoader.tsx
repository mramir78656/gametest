import { lazy, Suspense, useState, useEffect } from 'react';

// Define interface for the game loader props
interface GameLoaderProps {
  gameSlug: string;
  isMuted: boolean;
  onScoreUpdate?: (score: number) => void;
}

const GameLoader = ({ gameSlug, isMuted, onScoreUpdate }: GameLoaderProps) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Convert game slug to PascalCase for component naming
        const pascalCaseSlug = gameSlug
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('');

        // Dynamic import based on game slug
        const module = await import(`../games/${pascalCaseSlug}/index.tsx`);
        setComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load game: ${gameSlug}`, err);
        setError(`Could not load game "${gameSlug}". Please try another game.`);
      }
    };

    loadComponent();
  }, [gameSlug]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-900">
        <div className="text-red-500 font-bold text-xl mb-4">Game Error</div>
        <p className="text-white text-center">{error}</p>
        <button 
          className="mt-6 bg-primary text-white px-4 py-2 rounded-lg"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin mb-4"></div>
            <p>Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Component />
    </div>
  );
};

export default GameLoader;