import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

interface ScienceBubbleSortProps {
  onScoreUpdate?: (score: number) => void;
  isMuted?: boolean;
}

const TOTAL_ROUNDS = 5;

type Category = 'living' | 'nonliving';

interface BubbleItem {
  id: string;
  label: string;
  emoji: string;
  category: Category;
}

const POOL: Omit<BubbleItem, 'id'>[] = [
  { label: 'Fish', emoji: '🐟', category: 'living' },
  { label: 'Tree', emoji: '🌳', category: 'living' },
  { label: 'Bird', emoji: '🐦', category: 'living' },
  { label: 'Flower', emoji: '🌸', category: 'living' },
  { label: 'Rock', emoji: '🪨', category: 'nonliving' },
  { label: 'Ball', emoji: '⚽', category: 'nonliving' },
  { label: 'Cup', emoji: '🥤', category: 'nonliving' },
  { label: 'Car', emoji: '🚗', category: 'nonliving' },
];

function makeBubbles(): BubbleItem[] {
  return [...POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((item, i) => ({ ...item, id: `${item.label}-${Date.now()}-${i}` }));
}

const ScienceBubbleSort: React.FC<ScienceBubbleSortProps> = ({ onScoreUpdate, isMuted }) => {
  const { play } = useSound({ isMuted });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState(() => makeBubbles());
  const [popping, setPopping] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [dragOver, setDragOver] = useState<Category | null>(null);

  const progress = ((finished ? TOTAL_ROUNDS : round) / TOTAL_ROUNDS) * 100;
  const remaining = useMemo(() => bubbles.length, [bubbles.length]);

  const maybeAdvance = (nextBubbles: BubbleItem[], nextScore: number) => {
    if (nextBubbles.length === 0) {
      const nextRound = round + 1;
      window.setTimeout(() => {
        if (nextRound >= TOTAL_ROUNDS) {
          setFinished(true);
          play('complete');
          onScoreUpdate?.(nextScore);
        } else {
          setRound(nextRound);
          setBubbles(makeBubbles());
        }
      }, 450);
    }
  };

  const sortBubble = (item: BubbleItem, bin: Category) => {
    if (finished || popping) return;
    play('click');

    if (item.category === bin) {
      play('correct');
      setPopping(item.id);
      const nextScore = score + 15;
      setScore(nextScore);
      window.setTimeout(() => {
        const next = bubbles.filter((b) => b.id !== item.id);
        setBubbles(next);
        setPopping(null);
        maybeAdvance(next, nextScore);
      }, 320);
    } else {
      play('incorrect');
      setDragOver(null);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-sky-400 via-blue-300 to-indigo-400 p-4">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-3 w-3 rounded-full bg-white/50"
            style={{ left: `${8 + i * 9}%`, top: `${20 + (i % 4) * 15}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>

      <motion.div
        className="relative mx-auto max-w-3xl"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 210, damping: 16 }}
      >
        <header className="mb-4 rounded-2xl bg-indigo-950/50 px-4 py-3 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Science Bubble Sort</h1>
            <div className="text-right text-sm sm:text-base">
              <div>Score: {score}</div>
              <div>
                Set {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
              </div>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/25">
            <motion.div
              className="h-full rounded-full bg-sky-200"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.section
              key={round}
              className="rounded-2xl bg-white/80 p-5 shadow-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
            >
              <p className="mb-4 text-center text-xl font-semibold text-indigo-900">
                Pop each bubble into the right bin! ({remaining} left)
              </p>

              {/* Floating bubbles */}
              <div className="relative mb-6 flex min-h-[180px] flex-wrap items-center justify-center gap-4">
                <AnimatePresence>
                  {bubbles.map((item, i) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        const de = e as unknown as React.DragEvent;
                        de.dataTransfer?.setData('bubble', item.id);
                      }}
                      className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-white/90 to-sky-200/90 text-indigo-900 shadow-lg ring-2 ring-white/70"
                      initial={{ scale: 0, y: 40 }}
                      animate={
                        popping === item.id
                          ? { scale: [1, 1.35, 0], opacity: [1, 1, 0] }
                          : { scale: 1, y: [0, -10, 0] }
                      }
                      exit={{ scale: 0, opacity: 0 }}
                      transition={
                        popping === item.id
                          ? { duration: 0.3 }
                          : { y: { duration: 2 + i * 0.2, repeat: Infinity }, scale: { duration: 0.25 } }
                      }
                      title="Drag me to a bin (or tap a bin after selecting)"
                      onClick={() => {
                        // Tap-to-select then bin click handled via data attribute fallback:
                        (window as unknown as { __bubblePick?: string }).__bubblePick = item.id;
                      }}
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="text-xs font-bold">{item.label}</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>

              {/* Category bins */}
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    { id: 'living' as Category, title: 'Living', emoji: '🌱', color: 'from-emerald-400 to-green-600' },
                    { id: 'nonliving' as Category, title: 'Non-living', emoji: '🧱', color: 'from-slate-400 to-slate-600' },
                  ] as const
                ).map((bin) => (
                  <div
                    key={bin.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(bin.id);
                    }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(null);
                      const id = e.dataTransfer.getData('bubble');
                      const item = bubbles.find((b) => b.id === id);
                      if (item) sortBubble(item, bin.id);
                    }}
                    onClick={() => {
                      const pick = (window as unknown as { __bubblePick?: string }).__bubblePick;
                      const item = bubbles.find((b) => b.id === pick);
                      if (item) {
                        sortBubble(item, bin.id);
                        (window as unknown as { __bubblePick?: string }).__bubblePick = undefined;
                      }
                    }}
                    className={`cursor-pointer rounded-2xl bg-gradient-to-br p-6 text-center text-white shadow-md transition ${bin.color} ${
                      dragOver === bin.id ? 'ring-4 ring-yellow-300 scale-[1.02]' : ''
                    }`}
                  >
                    <div className="text-4xl">{bin.emoji}</div>
                    <div className="mt-2 text-xl font-bold">{bin.title}</div>
                    <div className="text-sm opacity-90">Drop or tap after picking a bubble</div>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              className="rounded-2xl bg-indigo-600 p-10 text-center text-white shadow-xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.15, 1], opacity: 1 }}
              transition={{ duration: 0.55 }}
            >
              <motion.div
                className="mb-3 text-6xl"
                animate={{ scale: [1, 1.3, 0.9, 1.1, 1] }}
                transition={{ duration: 0.7 }}
              >
                🫧
              </motion.div>
              <h2 className="text-3xl font-bold">All Sorted!</h2>
              <p className="mt-2 text-xl">Final score: {score}</p>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ScienceBubbleSort;
