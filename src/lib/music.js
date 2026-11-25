import { invitation } from '../data/invitation';

/**
 * Background music singleton. Never plays on page load: it is started from a guest gesture
 * (Skip / end of the opening video) or via the floating toggle.
 */
let audio = null;
let playing = false;
let wanted = false; // guest wants music (so we can resume after the venue video)
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

function get() {
  if (!audio) {
    audio = new Audio();
    audio.src = invitation.media.music;
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0;
    audio.addEventListener('play', () => { playing = true; emit(); });
    audio.addEventListener('pause', () => { playing = false; emit(); });
  }
  return audio;
}

let fadeId;
function fadeTo(target, ms = 1500) {
  const a = get();
  clearInterval(fadeId);
  const step = (target - a.volume) / (ms / 50);
  fadeId = setInterval(() => {
    const v = a.volume + step;
    if ((step >= 0 && v >= target) || (step < 0 && v <= target)) {
      a.volume = target;
      clearInterval(fadeId);
    } else a.volume = Math.max(0, Math.min(1, v));
  }, 50);
}

export const music = {
  /** Call inside a tap handler so iOS/Android later allow playback. */
  prime() {
    const a = get();
    a.muted = true;
    a.play().then(() => { a.pause(); a.muted = false; }).catch(() => { a.muted = false; });
  },
  async start() {
    const a = get();
    wanted = true;
    a.muted = false;
    try {
      await a.play();
      fadeTo(0.55);
    } catch {
      wanted = false; // blocked — the toggle button stays in "off" state
      emit();
    }
  },
  stop() {
    wanted = false;
    audio?.pause();
  },
  toggle() {
    return playing ? music.stop() : music.start();
  },
  /** temporary pause (e.g. venue video) */
  suspend() {
    if (playing) { audio.pause(); wanted = true; }
  },
  resume() {
    if (wanted && !playing) music.start();
  },
  isPlaying: () => playing,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};
