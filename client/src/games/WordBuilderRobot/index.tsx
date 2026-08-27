import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

interface WordBuilderRobotProps {
  onScoreUpdate?: (score: number) => void;
  isMuted?: boolean;
}

const TOTAL_ROUNDS = 6;

const WORDS = ['cat', 'dog', 'sun', 'hat', 'pen', 'bug', 'map', 'bus'];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function lettersFor(word: string): string[] {
  const extras = 'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .filter((c) => !word.includes(c))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return shuffle([...word.split(''), ...extras]);
}

const WordBuilderRobot: React.FC<WordBuilderRobotProps> = ({ onScoreUpdate, isMuted }) => {
  const { play } = useSound({ isMuted });
  const [session] = useState(() => {
    const deck = shuffle([...WORDS]);
    return { deck, initialTray: lettersFor(deck[0]) };
  });
  const { deck } = session;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const target = deck[round % deck.length];
  const [tray, setTray] = useState(() => session.initialTray);
  const [built, setBuilt] = useState<string[]>([]);
  const [armTo, setArmTo] = useState<{ x: number; y: number } | null>(null);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const progress = ((finished ? TOTAL_ROUNDS : round) / TOTAL_ROUNDS) * 100;

  const slots = useMemo(() => target.split(''), [target]);

  const resetRound = (nextRound: number) => {
    const w = deck[nextRound % deck.length];
    setTray(lettersFor(w));
    setBuilt([]);
    setHint(null);
    setLocked(false);
  };

  const placeLetter = (letter: string, index: number, clientX: number, clientY: number) => {
    if (locked || finished) return;
    play('click');

    const arena = document.getElementById('robot-arena');
    const rect = arena?.getBoundingClientRect();
    setArmTo({
      x: rect ? clientX - rect.left : 120,
      y: rect ? clientY - rect.top : 80,
    });

    const nextBuilt = [...built, letter];
    setBuilt(nextBuilt);
    setTray((prev) => prev.filter((_, i) => i !== index));

    window.setTimeout(() => setArmTo(null), 350);

    if (nextBuilt.length === target.length) {
      setLocked(true);
      const correct = nextBuilt.join('') === target;
      if (correct) {
        play('correct');
        const nextScore = score + 20;
        setScore(nextScore);
        setHint('Beep boop — word built!');
        const nextRound = round + 1;
        window.setTimeout(() => {
          if (nextRound >= TOTAL_ROUNDS) {
            setFinished(true);
            play('complete');
            onScoreUpdate?.(nextScore);
          } else {
            setRound(nextRound);
            resetRound(nextRound);
          }
        }, 800);
      } else {
        play('incorrect');
        setHint(`Not quite — the word was “${target}”`);
        window.setTimeout(() => {
          resetRound(round);
        }, 900);
      }
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-slate-700 via-blue-800 to-cyan-700 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <motion.div
        className="relative mx-auto max-w-3xl"
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      >
        <header className="mb-4 rounded-2xl bg-black/40 px-4 py-3 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Word Builder Robot</h1>
            <div className="text-right text-sm sm:text-base">
              <div>Score: {score}</div>
              <div>
                Build {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
              </div>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-cyan-300"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.section
              key={round}
              id="robot-arena"
              className="relative overflow-hidden rounded-2xl bg-slate-900/70 p-5 shadow-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <p className="mb-2 text-center text-lg text-cyan-100">
                Help the robot spell:{' '}
                <span className="font-bold text-amber-300">{target.length} letters</span>
              </p>
              <p className="mb-5 text-center text-sm text-slate-300">
                Hint: a word that sounds like “{target[0]}…{target[target.length - 1]}”
              </p>

              {/* Robot body + animated arm */}
              <div className="relative mb-6 flex justify-center">
                <div className="relative h-28 w-28 rounded-2xl bg-gradient-to-b from-slate-300 to-slate-500 shadow-lg">
                  <div className="absolute left-4 top-6 h-4 w-4 rounded-full bg-cyan-300" />
                  <div className="absolute right-4 top-6 h-4 w-4 rounded-full bg-cyan-300" />
                  <div className="absolute bottom-5 left-1/2 h-3 w-10 -translate-x-1/2 rounded bg-slate-700" />
                  <motion.div
                    className="absolute -right-2 top-10 h-3 origin-left rounded-full bg-amber-400"
                    style={{ width: 70 }}
                    animate={
                      armTo
                        ? { rotate: -25, scaleX: 1.4 }
                        : { rotate: [0, 8, 0], scaleX: 1 }
                    }
                    transition={armTo ? { duration: 0.25 } : { duration: 2, repeat: Infinity }}
                  />
                </div>
                <AnimatePresence>
                  {armTo && (
                    <motion.div
                      className="pointer-events-none absolute h-4 w-4 rounded-full bg-amber-300"
                      initial={{ left: '58%', top: 48, opacity: 1 }}
                      animate={{ left: armTo.x, top: armTo.y, opacity: 0.2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Build slots */}
              <div className="mb-6 flex justify-center gap-2">
                {slots.map((_, i) => (
                  <div
                    key={i}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-cyan-400/60 bg-slate-800 text-2xl font-bold uppercase text-white"
                  >
                    {built[i] ?? ''}
                  </div>
                ))}
              </div>

              {/* Letter tray */}
              <div className="flex flex-wrap justify-center gap-3">
                {tray.map((letter, index) => (
                  <motion.button
                    key={`${letter}-${index}-${tray.length}`}
                    type="button"
                    disabled={locked}
                    onClick={(e) => placeLetter(letter, index, e.clientX, e.clientY)}
                    className="h-14 w-14 rounded-xl bg-cyan-500 text-2xl font-bold uppercase text-white shadow-md hover:bg-cyan-400 disabled:opacity-50"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.92 }}
                    layout
                  >
                    {letter}
                  </motion.button>
                ))}
              </div>

              {hint && <p className="mt-4 text-center text-lg font-semibold text-amber-200">{hint}</p>}
            </motion.section>
          ) : (
            <motion.section
              className="rounded-2xl bg-cyan-500 p-10 text-center text-white shadow-xl"
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 14 }}
            >
              <motion.div
                className="mb-3 text-6xl"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.6 }}
              >
                🤖
              </motion.div>
              <h2 className="text-3xl font-bold">Systems Online!</h2>
              <p className="mt-2 text-xl">Final score: {score}</p>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WordBuilderRobot;
