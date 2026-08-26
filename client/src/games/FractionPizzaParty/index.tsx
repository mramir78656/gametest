import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

interface FractionPizzaPartyProps {
  onScoreUpdate?: (score: number) => void;
  isMuted?: boolean;
}

const TOTAL_ROUNDS = 6;

const TARGETS = [
  { num: 1, den: 2 },
  { num: 1, den: 3 },
  { num: 2, den: 3 },
  { num: 1, den: 4 },
  { num: 3, den: 4 },
  { num: 2, den: 4 },
];

function slicePath(index: number, total: number, radius = 90): string {
  const start = (index / total) * Math.PI * 2 - Math.PI / 2;
  const end = ((index + 1) / total) * Math.PI * 2 - Math.PI / 2;
  const x1 = 100 + radius * Math.cos(start);
  const y1 = 100 + radius * Math.sin(start);
  const x2 = 100 + radius * Math.cos(end);
  const y2 = 100 + radius * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
}

const FractionPizzaParty: React.FC<FractionPizzaPartyProps> = ({ onScoreUpdate, isMuted }) => {
  const { play } = useSound({ isMuted });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [filled, setFilled] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const target = TARGETS[round % TARGETS.length];
  const progress = ((finished ? TOTAL_ROUNDS : round) / TOTAL_ROUNDS) * 100;

  const traySlices = useMemo(
    () => Array.from({ length: target.den }, (_, i) => i),
    [target.den, round]
  );

  const checkPizza = (nextFilled: number[]) => {
    if (nextFilled.length === target.num) {
      play('correct');
      const nextScore = score + 25;
      setScore(nextScore);
      setMessage('Delicious! Perfect fraction pizza!');
      const nextRound = round + 1;
      window.setTimeout(() => {
        setMessage(null);
        setFilled([]);
        if (nextRound >= TOTAL_ROUNDS) {
          setFinished(true);
          play('complete');
          onScoreUpdate?.(nextScore);
        } else {
          setRound(nextRound);
        }
      }, 900);
    } else if (nextFilled.length > target.num) {
      play('incorrect');
      setMessage('Too many slices — shake them off!');
      window.setTimeout(() => {
        setFilled([]);
        setMessage(null);
      }, 700);
    }
  };

  const addSlice = (sliceIndex: number) => {
    if (finished || filled.includes(sliceIndex) || filled.length >= target.den) return;
    play('click');
    const next = [...filled, sliceIndex];
    setFilled(next);
    checkPizza(next);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const raw = e.dataTransfer.getData('slice');
    if (raw === '') return;
    addSlice(Number(raw));
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-yellow-200 p-4">
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-yellow-200/50 blur-3xl" />

      <motion.div
        className="relative mx-auto max-w-3xl"
        initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      >
        <header className="mb-4 rounded-2xl bg-rose-900/70 px-4 py-3 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Fraction Pizza Party</h1>
            <div className="text-right text-sm sm:text-base">
              <div>Score: {score}</div>
              <div>
                Pizza {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
              </div>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/25">
            <motion.div
              className="h-full rounded-full bg-yellow-300"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.section
              key={round}
              className="rounded-2xl bg-white/90 p-5 shadow-xl"
              initial={{ opacity: 0, rotate: 8 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -8 }}
            >
              <p className="mb-4 text-center text-2xl font-semibold text-rose-900">
                Build <span className="text-orange-600">{target.num}/{target.den}</span> of the pizza
              </p>

              <div className="grid items-center gap-6 md:grid-cols-2">
                {/* Pizza drop target */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`mx-auto flex h-56 w-56 items-center justify-center rounded-full border-4 border-dashed ${
                    dragging ? 'border-orange-500 bg-orange-100' : 'border-rose-300 bg-amber-50'
                  }`}
                >
                  <svg viewBox="0 0 200 200" className="h-48 w-48">
                    <circle cx="100" cy="100" r="92" fill="#f5d76e" stroke="#c0392b" strokeWidth="6" />
                    {traySlices.map((i) => (
                      <path
                        key={i}
                        d={slicePath(i, target.den)}
                        fill={filled.includes(i) ? '#e74c3c' : 'transparent'}
                        stroke="#a04000"
                        strokeWidth="1.5"
                        opacity={filled.includes(i) ? 1 : 0.25}
                      />
                    ))}
                  </svg>
                </div>

                {/* Draggable / clickable slices */}
                <div>
                  <p className="mb-3 text-center text-sm font-medium text-rose-800">
                    Drag slices onto the pizza (or tap them)
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {traySlices.map((i) => {
                      const used = filled.includes(i);
                      return (
                        <motion.button
                          key={i}
                          type="button"
                          draggable={!used}
                          disabled={used}
                          onDragStart={(e) => {
                            const de = e as unknown as React.DragEvent;
                            de.dataTransfer?.setData('slice', String(i));
                          }}
                          onClick={() => addSlice(i)}
                          className="h-16 w-16 disabled:opacity-30"
                          initial={{ y: 30, opacity: 0, rotate: -20 }}
                          animate={{ y: 0, opacity: used ? 0.35 : 1, rotate: 0 }}
                          whileHover={used ? undefined : { scale: 1.08, rotate: 6 }}
                          transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 14 }}
                        >
                          <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow">
                            <path d={slicePath(0, target.den, 85)} fill="#e74c3c" stroke="#922b21" strokeWidth="4" />
                          </svg>
                        </motion.button>
                      );
                    })}
                  </div>
                  {message && (
                    <p className="mt-4 text-center text-lg font-semibold text-rose-800">{message}</p>
                  )}
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              className="rounded-2xl bg-orange-500 p-10 text-center text-white shadow-xl"
              initial={{ scale: 0.4, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12 }}
            >
              <div className="mb-3 text-6xl">🍕</div>
              <h2 className="text-3xl font-bold">Party Time!</h2>
              <p className="mt-2 text-xl">Final score: {score}</p>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FractionPizzaParty;
