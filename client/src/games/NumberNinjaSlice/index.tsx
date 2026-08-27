import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

interface NumberNinjaSliceProps {
  onScoreUpdate?: (score: number) => void;
  isMuted?: boolean;
}

interface FallingNum {
  id: number;
  value: number;
  x: number;
  duration: number;
  isTarget: boolean;
}

const TOTAL_ROUNDS = 8;

function makeProblem(level: number) {
  const max = Math.min(5 + level * 2, 15);
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  const subtract = Math.random() > 0.45 && a >= b;
  const answer = subtract ? a - b : a + b;
  const prompt = subtract ? `${a} − ${b} = ?` : `${a} + ${b} = ?`;
  return { prompt, answer };
}

function makeFalling(answer: number): FallingNum[] {
  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const n = answer + (Math.floor(Math.random() * 9) - 4);
    if (n !== answer && n >= 0 && n <= 30) wrong.add(n);
  }
  const values = [answer, ...wrong].sort(() => Math.random() - 0.5);
  return values.map((value, i) => ({
    id: Date.now() + i,
    value,
    x: 12 + i * 22 + Math.random() * 6,
    duration: 3.2 + Math.random() * 1.4,
    isTarget: value === answer,
  }));
}

const NumberNinjaSlice: React.FC<NumberNinjaSliceProps> = ({ onScoreUpdate, isMuted }) => {
  const { play } = useSound({ isMuted });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState(() => makeProblem(1));
  const [falling, setFalling] = useState<FallingNum[]>([]);
  const [slash, setSlash] = useState<{ x: number; y: number; id: number } | null>(null);
  const [finished, setFinished] = useState(false);
  const [missFlash, setMissFlash] = useState(false);
  const lockedRef = useRef(false);
  const scoreRef = useRef(0);

  const startRound = useCallback((r: number) => {
    lockedRef.current = false;
    const p = makeProblem(Math.floor(r / 2) + 1);
    setProblem(p);
    setFalling(makeFalling(p.answer));
  }, []);

  useEffect(() => {
    startRound(0);
  }, [startRound]);

  const progress = ((finished ? TOTAL_ROUNDS : round) / TOTAL_ROUNDS) * 100;

  const advance = (nextScore: number) => {
    const nextRound = round + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      setFinished(true);
      play('complete');
      onScoreUpdate?.(nextScore);
    } else {
      setRound(nextRound);
      startRound(nextRound);
    }
  };

  const onSlice = (item: FallingNum, clientX: number, clientY: number) => {
    if (lockedRef.current || finished) return;
    lockedRef.current = true;
    play('click');

    const rect = (document.getElementById('ninja-arena') as HTMLElement | null)?.getBoundingClientRect();
    const x = rect ? clientX - rect.left : clientX;
    const y = rect ? clientY - rect.top : clientY;
    setSlash({ x, y, id: Date.now() });

    if (item.isTarget) {
      play('correct');
      const nextScore = scoreRef.current + 15;
      scoreRef.current = nextScore;
      setScore(nextScore);
      setFalling((prev) => prev.filter((f) => f.id !== item.id));
      window.setTimeout(() => advance(nextScore), 450);
    } else {
      play('incorrect');
      setMissFlash(true);
      window.setTimeout(() => {
        setMissFlash(false);
        lockedRef.current = false;
      }, 500);
    }
  };

  const onMissedTarget = (item: FallingNum) => {
    if (!item.isTarget || lockedRef.current || finished) {
      setFalling((prev) => prev.filter((f) => f.id !== item.id));
      return;
    }
    lockedRef.current = true;
    play('incorrect');
    setFalling((prev) => prev.filter((f) => f.id !== item.id));
    window.setTimeout(() => advance(scoreRef.current), 400);
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-red-950 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,80,80,0.15),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(80,120,255,0.12),transparent_45%)]" />

      <motion.div
        className="relative mx-auto max-w-3xl"
        initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 16 }}
      >
        <header className="mb-4 rounded-2xl bg-black/40 px-4 py-3 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-red-300 sm:text-3xl">Number Ninja Slice</h1>
            <div className="text-right text-sm sm:text-base">
              <div>Score: {score}</div>
              <div>
                Slash {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
              </div>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-red-400"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.section
              key={round}
              id="ninja-arena"
              className={`relative h-[420px] overflow-hidden rounded-2xl border border-red-400/30 bg-black/35 ${
                missFlash ? 'ring-4 ring-red-500' : ''
              }`}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <div className="absolute inset-x-0 top-4 z-10 text-center">
                <p className="inline-block rounded-full bg-red-600/90 px-5 py-2 text-2xl font-bold text-white shadow-lg">
                  {problem.prompt}
                </p>
                <p className="mt-2 text-sm text-red-100/80">Slice the number that completes the equation!</p>
              </div>

              {/* Slash trail */}
              <AnimatePresence>
                {slash && (
                  <motion.div
                    key={slash.id}
                    className="pointer-events-none absolute z-20 h-1 w-28 origin-left rounded-full bg-gradient-to-r from-white via-red-300 to-transparent"
                    style={{ left: slash.x, top: slash.y }}
                    initial={{ scaleX: 0, opacity: 1, rotate: -35 }}
                    animate={{ scaleX: 1, opacity: 0, rotate: -35 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                )}
              </AnimatePresence>

              {falling.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  className={`absolute top-0 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full text-2xl font-black shadow-lg ${
                    item.isTarget
                      ? 'bg-gradient-to-br from-amber-300 to-orange-500 text-slate-900'
                      : 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800'
                  }`}
                  style={{ left: `${item.x}%` }}
                  initial={{ y: -80, rotate: -20 }}
                  animate={{ y: 460, rotate: 25 }}
                  transition={{ duration: item.duration, ease: 'linear' }}
                  onAnimationComplete={() => onMissedTarget(item)}
                  onClick={(e) => onSlice(item, e.clientX, e.clientY)}
                >
                  {item.value}
                </motion.button>
              ))}
            </motion.section>
          ) : (
            <motion.section
              className="rounded-2xl bg-gradient-to-br from-red-500 to-amber-400 p-10 text-center text-white shadow-xl"
              initial={{ scale: 0.5, rotate: 12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <motion.div
                className="mx-auto mb-4 text-6xl"
                animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                🥷
              </motion.div>
              <h2 className="text-3xl font-bold">Ninja Master!</h2>
              <p className="mt-2 text-xl">Final score: {score}</p>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NumberNinjaSlice;
