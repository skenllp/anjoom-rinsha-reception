import { useSyncExternalStore } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { music } from '../lib/music';

export default function MusicToggle() {
  const on = useSyncExternalStore(music.subscribe, music.isPlaying);
  return (
    <button
      type="button"
      onClick={() => music.toggle()}
      aria-label={on ? 'Pause background music' : 'Play background music'}
      aria-pressed={on}
      className="fixed right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-silver/55 bg-midnight/60 text-ivory shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md transition-transform active:scale-95"
      style={{ bottom: 'calc(var(--safe-bottom) + 16px)' }}
    >
      {on ? <Music size={19} className="animate-pulse" /> : <VolumeX size={19} />}
    </button>
  );
}
