/**
 * Game template — copy this folder, rename it (PascalCase), and replace the
 * sample quiz logic with your game mechanic.
 *
 * Conventions:
 * - Accept onScoreUpdate + isMuted
 * - Use useSound for correct / incorrect / complete (and click/win as needed)
 * - Call onScoreUpdate with the final score when the round set finishes
 * - Keep the shared header + progress bar styling
 * - Entrance uses a spring "pop-in from below" (NOT the static card style of AdditionArcade)
 */
import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

interface TemplateGameProps {
  onScoreUpdate?: (score: number) => void;
  isMuted?: boolean;
}

const TOTAL_ROUNDS = 5;

/** Sample questions — replace with your content. */
const SAMPLE_QUESTIONS = [
  { prompt: 'What is 2 + 3?', options: [4, 5, 6], answer: 5 },
  { prompt: 'What is 7 - 2?', options: [4, 5, 6], answer: 5 },
  { prompt: 'What is 1 + 4?', options: [3, 4, 5], answer: 5 },
  { prompt: 'What is 9 - 3?', options: [5, 6, 7], answer: 6 },
  { prompt: 'What is 3 + 3?', options: [5, 6, 7], answer: 6 },
];

const TemplateGame: React.FC<TemplateGameProps> = ({ onScoreUpdate, isMuted }) => {
  const { play } = useSound({ isMuted });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);

  const question = useMemo(() => SAMPLE_QUESTIONS[round] ?? SAMPLE_QUESTIONS[0], [round]);
  const progress = ((finished ? TOTAL_ROUNDS : round) / TOTAL_ROUNDS) * 100;

  const finishGame = (finalScore: number) => {
    setFinished(true);
    play('complete');
    onScoreUpdate?.(finalScore);
  };

  const handleAnswer = (choice: number) => {
    if (locked || finished) return;
    setLocked(true);
    play('click');

    const correct = choice === question.answer;
    if (correct) {
      play('correct');
      const nextScore = score + 20;
      setScore(nextScore);
      setFeedback('Nice!');
      const nextRound = round + 1;
      window.setTimeout(() => {
        setFeedback(null);
        setLocked(false);
        if (nextRound >= TOTAL_ROUNDS) {
          finishGame(nextScore);
        } else {
          setRound(nextRound);
        }
      }, 700);
    } else {
      play('incorrect');
      setFeedback('Try again!');
      window.setTimeout(() => {
        setFeedback(null);
        setLocked(false);
      }, 700);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-500 to-sky-400 p-4">
      {/* Soft atmosphere blobs (not a flat fill) */}
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

      <motion.div
        className="relative mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 48, scale: 0.92, rotate: -2 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        {/* Shared header + progress */}
        <header className="mb-4 rounded-2xl bg-black/25 px-4 py-3 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Template Game</h1>
            <div className="text-right text-sm sm:text-base">
              <div>Score: {score}</div>
              <div>
                Round {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
              </div>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/25">
            <motion.div
              className="h-full rounded-full bg-amber-300"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.section
              key={round}
              className="rounded-2xl bg-white/90 p-6 shadow-xl"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-6 text-center text-2xl font-semibold text-slate-800">{question.prompt}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={locked}
                    onClick={() => handleAnswer(option)}
                    className="rounded-xl bg-teal-600 px-4 py-4 text-xl font-bold text-white transition hover:bg-teal-500 disabled:opacity-60"
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedback && (
                <p className="mt-4 text-center text-lg font-semibold text-slate-700">{feedback}</p>
              )}
            </motion.section>
          ) : (
            /* Celebration — radial burst (distinct from AdditionArcade star pulse) */
            <motion.section
              key="done"
              className="relative overflow-hidden rounded-2xl bg-white/95 p-10 text-center shadow-xl"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-amber-400"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i / 8) * Math.PI * 2) * 110,
                    y: Math.sin((i / 8) * Math.PI * 2) * 110,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              ))}
              <h2 className="text-3xl font-bold text-teal-700">Complete!</h2>
              <p className="mt-2 text-xl text-slate-700">Final score: {score}</p>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TemplateGame;
