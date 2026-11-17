import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { invitation } from '../data/invitation';

/**
 * Fullscreen 9:16 cinematic opening.
 * - Nothing plays until the guest taps (no autoplay audio).
 * - The video is letter/pillar-boxed with object-fit: contain so the acrylic card is never cropped;
 *   soft mask edges melt it into the royal-blue backdrop (no hard bars, no black flash).
 * - `onFinish` is called on end / skip / error; the parent cross-fades this overlay away.
 */
export default function Intro({ onFinish }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | loading | playing
  const [muted, setMuted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    videoRef.current?.pause();
    onFinish();
  };

  const start = async () => {
    const v = videoRef.current;
    if (!v || phase !== 'idle') return;
    setPhase('loading');
    v.muted = false;
    try {
      await v.play();
      setMuted(false);
      setPhase('playing');
    } catch {
      try {
        v.muted = true; // some browsers refuse sound — fall back to silent playback
        await v.play();
        setMuted(true);
        setPhase('playing');
      } catch {
        finish(); // video cannot play at all → go straight to the invitation
      }
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-midnight"
      role="dialog"
      aria-label="Wedding reception invitation opening"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: 'easeInOut' }}
    >
      {/* backdrop identical to the invitation page so the fade has no colour jump */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-satin.webp')" }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          className="object-cover"
          style={{
            width: 'min(100vw, calc(100dvh * 9 / 16))',
            height: 'min(100dvh, calc(100vw * 16 / 9))',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0, #000 8%, #000 92%, transparent 100%), linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
            WebkitMaskComposite: 'source-in',
            maskImage:
              'linear-gradient(to bottom, transparent 0, #000 8%, #000 92%, transparent 100%), linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
            maskComposite: 'intersect',
          }}
          src={invitation.media.introVideo}
          poster={invitation.media.introPoster}
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          onLoadedData={() => setVideoReady(true)}
          onEnded={finish}
          onError={finish}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* top controls */}
      <div
        className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4"
        style={{ paddingTop: 'calc(var(--safe-top) + 14px)' }}
      >
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-silver/50 bg-midnight/40 text-ivory backdrop-blur transition-opacity ${
            phase === 'playing' ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button
          type="button"
          onClick={finish}
          className="flex min-h-[44px] items-center gap-2 rounded-full border border-silver/50 bg-midnight/40 px-4 text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-ivory backdrop-blur"
        >
          Skip Intro <SkipForward size={15} />
        </button>
      </div>

      {/* Tap to open */}
      {phase !== 'playing' && (
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-6"
          style={{ paddingBottom: 'calc(var(--safe-bottom) + 12vh)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
        >
          <p className="eyebrow text-center !text-ivory/90 drop-shadow">You are invited</p>
          <button
            type="button"
            onClick={start}
            disabled={phase === 'loading'}
            className="pill-btn pill-btn--solid !px-9 !text-[1rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]"
          >
            {phase === 'loading' ? 'Opening…' : 'Tap to Open'}
          </button>
          {!videoReady && phase === 'idle' && <span className="sr-only">Loading video</span>}
        </motion.div>
      )}
    </motion.div>
  );
}
