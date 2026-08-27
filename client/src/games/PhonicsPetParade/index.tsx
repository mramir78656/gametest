import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

interface PhonicsPetParadeProps {
  onScoreUpdate?: (score: number) => void;
  isMuted?: boolean;
}

const TOTAL_ROUNDS = 6;

const PETS = [
  { letter: 'A', sound: 'æ as in apple', emoji: '🐶', name: 'Dog' },
  { letter: 'B', sound: 'b as in ball', emoji: '🐰', name: 'Bunny' },
  { letter: 'C', sound: 'k as in cat', emoji: '🐱', name: 'Cat' },
  { letter: 'D', sound: 'd as in dog', emoji: '🦆', name: 'Duck' },
  { letter: 'M', sound: 'm as in mom', emoji: '🐵', name: 'Monkey' },
  { letter: 'S', sound: 's as in sun', emoji: '🐍', name: 'Snake' },
  { letter: 'T', sound: 't as in top', emoji: '🐢', name: 'Turtle' },
  { letter: 'P', sound: 'p as in pig', emoji: '🐷', name: 'Pig' },
] as const;

type Pet = (typeof PETS)[number];

function speakLetter(letter: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(letter);
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function pickRound(): { target: Pet; parade: Pet[] } {
  const target = PETS[Math.floor(Math.random() * PETS.length)];
  const others = PETS.filter((p) => p.letter !== target.letter)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const parade = [...others, target].sort(() => Math.random() - 0.5);
  return { target, parade };
}

const PhonicsPetParade: React.FC<PhonicsPetParadeProps> = ({ onScoreUpdate, isMuted }) => {
  const { play } = useSound({ isMuted });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [pack, setPack] = useState(() => pickRound());
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bounceId, setBounceId] = useState<string | null>(null);

  const progress = ((finished ? TOTAL_ROUNDS : round) / TOTAL_ROUNDS) * 100;

  const replaySound = useCallback(() => {
    play('click');
    speakLetter(pack.target.letter);
  }, [pack.target.letter, play]);

  useEffect(() => {
    speakLetter(pack.target.letter);
  }, [pack.target.letter, round]);

  const handlePick = (pet: Pet) => {
    if (locked || finished) return;
    setLocked(true);
    play('click');
    setBounceId(pet.letter);

    if (pet.letter === pack.target.letter) {
      play('correct');
      const nextScore = score + 20;
      setScore(nextScore);
      const nextRound = round + 1;
      window.setTimeout(() => {
        setBounceId(null);
        if (nextRound >= TOTAL_ROUNDS) {
          setFinished(true);
          play('complete');
          onScoreUpdate?.(nextScore);
        } else {
          setRound(nextRound);
          setPack(pickRound());
          setLocked(false);
        }
      }, 650);
    } else {
      play('incorrect');
      window.setTimeout(() => {
        setBounceId(null);
        setLocked(false);
      }, 500);
    }
  };

  const hint = useMemo(() => `Find the pet for the letter sound: “${pack.target.letter}”`, [pack.target.letter]);

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-r from-lime-300 via-emerald-200 to-sky-300 p-4">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-amber-700/40 to-transparent" />

      <motion.div
        className="relative mx-auto max-w-3xl"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      >
        <header className="mb-4 rounded-2xl bg-emerald-900/70 px-4 py-3 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Phonics Pet Parade</h1>
            <div className="text-right text-sm sm:text-base">
              <div>Score: {score}</div>
              <div>
                Parade {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
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
              className="overflow-hidden rounded-2xl bg-white/85 p-5 shadow-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-center">
                <p className="text-xl font-semibold text-emerald-900">{hint}</p>
                <button
                  type="button"
                  onClick={replaySound}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500"
                >
                  🔊 Hear sound
                </button>
              </div>
              <p className="mb-3 text-center text-sm text-emerald-800/80">
                Sound clue: {pack.target.sound}
              </p>

              {/* Marching parade lane */}
              <div className="relative h-44 overflow-hidden rounded-xl bg-gradient-to-b from-sky-100 to-lime-100">
                <motion.div
                  className="absolute inset-y-0 flex items-center gap-6 px-4"
                  initial={{ x: '100%' }}
                  animate={{ x: ['100%', '-10%'] }}
                  transition={{ duration: 7, ease: 'linear', repeat: Infinity }}
                >
                  {[...pack.parade, ...pack.parade].map((pet, i) => (
                    <motion.button
                      key={`${pet.letter}-${i}`}
                      type="button"
                      disabled={locked}
                      onClick={() => handlePick(pet)}
                      className="flex w-24 flex-col items-center rounded-2xl bg-white/90 p-3 shadow-md"
                      animate={
                        bounceId === pet.letter
                          ? { y: [0, -18, 0], scale: [1, 1.15, 1] }
                          : { y: [0, -6, 0] }
                      }
                      transition={
                        bounceId === pet.letter
                          ? { duration: 0.45 }
                          : { duration: 0.9 + (i % 3) * 0.15, repeat: Infinity }
                      }
                    >
                      <span className="text-4xl">{pet.emoji}</span>
                      <span className="mt-1 text-lg font-bold text-emerald-800">{pet.letter}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              className="rounded-2xl bg-emerald-700 p-10 text-center text-white shadow-xl"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            >
              <motion.div
                className="mb-3 flex justify-center gap-2 text-4xl"
                animate={{ x: [0, 12, 0] }}
                transition={{ duration: 1.2, repeat: 2 }}
              >
                <span>🐶</span>
                <span>🐱</span>
                <span>🐷</span>
                <span>🐢</span>
              </motion.div>
              <h2 className="text-3xl font-bold">Parade Perfect!</h2>
              <p className="mt-2 text-xl">Final score: {score}</p>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PhonicsPetParade;
