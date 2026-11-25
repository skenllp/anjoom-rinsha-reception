import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { invitation } from '../data/invitation';
import { Reveal, SectionHeading } from './ui';

/** Poster card — NO <video> exists in the DOM until the guest opens the modal, so nothing is downloaded early. */
export function VenueVideoSection({ onOpenTour }) {
  const { media } = invitation;
  return (
    <section id="tour" className="relative px-4 py-16 sm:py-24">
      <SectionHeading eyebrow="A glimpse inside" title="Venue Tour" />
      <Reveal className="mx-auto mt-10 max-w-3xl">
        <button
          type="button"
          onClick={onOpenTour}
          aria-label="Play the Khayaal Palace venue tour video"
          className="group relative block w-full overflow-hidden rounded-[1.75rem] border border-silver/35 shadow-[0_30px_70px_-25px_rgba(2,10,40,0.9)] ring-1 ring-white/10"
        >
          <img
            src={media.tourPoster}
            alt="Khayaal Palace venue tour — video poster"
            width="900"
            height="506"
            loading="lazy"
            decoding="async"
            className="aspect-video w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/20 to-midnight/30" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ivory/70 bg-midnight/45 text-ivory backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-active:scale-95 sm:h-24 sm:w-24">
              <Play size={26} fill="currentColor" className="ml-1" />
            </span>
          </span>
          <span className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-6">
            <span className="eyebrow hidden !text-ivory/90 sm:block">Khayaal Palace</span>
            <span className="mt-1 block font-display text-lg italic text-ivory sm:text-2xl">Take a walk through the venue</span>
          </span>
        </button>
      </Reveal>
    </section>
  );
}

/** Responsive modal player. Playback only starts from the user's tap. */
export function VenueTourModal({ open, onClose }) {
  const videoRef = useRef(null);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const lastFocus = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  // body scroll lock + focus handling
  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    setLoading(true);
    setError(false);
    setProgress(0);
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
      lastFocus.current?.focus?.();
    };
  }, [open]);

  // start playback (the open action was the user's gesture)
  const onCanPlay = useCallback(async () => {
    setLoading(false);
    const v = videoRef.current;
    if (!v || !v.paused) return;
    try {
      v.muted = false;
      await v.play();
      setMuted(false);
    } catch {
      try {
        v.muted = true;
        await v.play();
        setMuted(true);
      } catch {
        /* the guest can press play */
      }
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll('button:not([disabled])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#051a44]/90 p-3 backdrop-blur-md sm:p-8"
          style={{ paddingTop: 'max(0.75rem, var(--safe-top))', paddingBottom: 'max(0.75rem, var(--safe-bottom))' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Khayaal Palace venue tour"
            className="w-full max-w-4xl"
            initial={{ y: 24, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-2xl border border-silver/40 bg-midnight shadow-[0_40px_90px_-20px_rgba(0,0,0,0.8)]">
              <video
                ref={videoRef}
                src={invitation.media.tourVideo}
                poster={invitation.media.tourPoster}
                className="aspect-video max-h-[78vh] w-full bg-midnight object-contain"
                playsInline
                preload="auto"
                disablePictureInPicture
                controls={false}
                onCanPlay={onCanPlay}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onWaiting={() => setLoading(true)}
                onPlaying={() => setLoading(false)}
                onError={() => {
                  setError(true);
                  setLoading(false);
                }}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration) setProgress(v.currentTime / v.duration);
                }}
                onClick={togglePlay}
              />

              {loading && !error && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-midnight/30">
                  <Loader2 className="animate-spin text-ivory" size={34} aria-label="Loading video" />
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-midnight/85 p-6 text-center">
                  <p className="text-lg text-ivory">Sorry, the venue tour could not be loaded right now. Please try again in a moment.</p>
                </div>
              )}

              {/* controls */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/90 to-transparent px-3 pb-3 pt-10">
                <div className="mb-2 h-[3px] w-full overflow-hidden rounded-full bg-white/20" aria-hidden="true">
                  <div className="h-full bg-ivory" style={{ width: `${progress * 100}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause video' : 'Play video'} className="flex h-11 w-11 items-center justify-center rounded-full border border-silver/50 bg-midnight/50 text-ivory">
                      {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute video' : 'Mute video'} className="flex h-11 w-11 items-center justify-center rounded-full border border-silver/50 bg-midnight/50 text-ivory">
                      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                  </div>
                  <button ref={closeRef} type="button" onClick={onClose} aria-label="Close venue tour" className="flex h-11 w-11 items-center justify-center rounded-full border border-silver/50 bg-midnight/50 text-ivory">
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
