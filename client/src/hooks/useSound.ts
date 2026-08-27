import { useCallback, useEffect, useState } from 'react';

/**
 * Shared short SFX names used across educational games.
 * Drop real files into /public/sounds/{name}.mp3 to replace the synth fallback.
 */
export type SoundName = 'correct' | 'incorrect' | 'click' | 'win' | 'complete';

const SOUND_NAMES: SoundName[] = ['correct', 'incorrect', 'click', 'win', 'complete'];

/** Module-level mute so every game shares one toggle. */
let globalMuted = false;
const muteListeners = new Set<(muted: boolean) => void>();

function notifyMuteListeners() {
  muteListeners.forEach((listener) => listener(globalMuted));
}

export function setGlobalMuted(muted: boolean) {
  globalMuted = muted;
  notifyMuteListeners();
}

export function getGlobalMuted() {
  return globalMuted;
}

type AudioContextCtor = typeof AudioContext;

function getAudioContextConstructor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null;
  return window.AudioContext || (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext || null;
}

/** Distinct placeholder tones when an mp3 is missing or fails to decode. */
function playSynthTone(name: SoundName) {
  const Ctor = getAudioContextConstructor();
  if (!Ctor) return;

  try {
    const ctx = new Ctor();
    const now = ctx.currentTime;

    const tone = (
      frequency: number,
      startOffset: number,
      duration: number,
      type: OscillatorType = 'sine',
      gainValue = 0.18
    ) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now + startOffset);
      gain.gain.setValueAtTime(gainValue, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now + startOffset);
      oscillator.stop(now + startOffset + duration);
    };

    switch (name) {
      case 'correct':
        tone(523.25, 0, 0.12);
        tone(659.25, 0.1, 0.14);
        tone(783.99, 0.2, 0.2);
        break;
      case 'incorrect':
        tone(220, 0, 0.18, 'triangle', 0.14);
        tone(174.61, 0.16, 0.22, 'triangle', 0.12);
        break;
      case 'click':
        tone(880, 0, 0.06, 'square', 0.08);
        break;
      case 'win':
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          tone(freq, i * 0.12, 0.28, 'sine', 0.2);
        });
        break;
      case 'complete':
        tone(392, 0, 0.15);
        tone(523.25, 0.12, 0.15);
        tone(659.25, 0.24, 0.15);
        tone(784, 0.36, 0.35);
        break;
    }

    // Close after tones finish so we don't leak contexts.
    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 1200);
  } catch {
    // Autoplay policies / unsupported contexts — ignore.
  }
}

const audioCache = new Map<SoundName, HTMLAudioElement>();
const failedSounds = new Set<SoundName>();
let preloadStarted = false;

/** Prefer real mp3s; fall back to sibling .wav placeholders, then synth. */
function loadAudioForSound(name: SoundName, src: string): HTMLAudioElement {
  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.addEventListener('error', () => {
    // If mp3 failed, try wav once before marking as failed.
    if (src.endsWith('.mp3')) {
      const wav = new Audio(`/sounds/${name}.wav`);
      wav.preload = 'auto';
      wav.addEventListener('error', () => {
        failedSounds.add(name);
        audioCache.delete(name);
      });
      wav.addEventListener('canplaythrough', () => {
        failedSounds.delete(name);
        audioCache.set(name, wav);
      });
      wav.load();
      return;
    }
    failedSounds.add(name);
    audioCache.delete(name);
  });
  audio.addEventListener('canplaythrough', () => {
    failedSounds.delete(name);
    audioCache.set(name, audio);
  });
  audio.load();
  return audio;
}

function preloadSounds() {
  if (preloadStarted || typeof window === 'undefined') return;
  preloadStarted = true;

  SOUND_NAMES.forEach((name) => {
    try {
      const audio = loadAudioForSound(name, `/sounds/${name}.mp3`);
      audioCache.set(name, audio);
    } catch {
      failedSounds.add(name);
    }
  });
}

function playSound(name: SoundName) {
  if (globalMuted) return;

  const cached = audioCache.get(name);
  if (cached && !failedSounds.has(name)) {
    try {
      cached.currentTime = 0;
      const playPromise = cached.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {
          // Decode/autoplay failure → synth placeholder (never crash a game).
          playSynthTone(name);
        });
        return;
      }
      return;
    } catch {
      playSynthTone(name);
      return;
    }
  }

  playSynthTone(name);
}

export interface UseSoundOptions {
  /** Optional external mute (e.g. GameLoader isMuted). Combined with global mute. */
  isMuted?: boolean;
}

export interface UseSoundResult {
  play: (name: SoundName) => void;
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

/**
 * Preloads short SFX clips, exposes play/mute helpers, and never throws
 * if a file is missing — falls back to a Web Audio beep instead.
 */
export function useSound(options: UseSoundOptions = {}): UseSoundResult {
  const { isMuted: externalMuted = false } = options;
  const [isMuted, setIsMutedState] = useState(() => globalMuted || externalMuted);

  useEffect(() => {
    preloadSounds();
  }, []);

  useEffect(() => {
    const listener = (muted: boolean) => {
      setIsMutedState(muted || externalMuted);
    };
    muteListeners.add(listener);
    setIsMutedState(globalMuted || externalMuted);
    return () => {
      muteListeners.delete(listener);
    };
  }, [externalMuted]);

  const setMuted = useCallback((muted: boolean) => {
    setGlobalMuted(muted);
  }, []);

  const toggleMute = useCallback(() => {
    setGlobalMuted(!globalMuted);
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (globalMuted || externalMuted) return;
      playSound(name);
    },
    [externalMuted]
  );

  return {
    play,
    isMuted,
    toggleMute,
    setMuted,
  };
}

export default useSound;
