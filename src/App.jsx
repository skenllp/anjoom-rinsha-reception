import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Intro from './components/Intro';
import Hero from './components/Hero';
import Families from './components/Families';
import SaveTheDate from './components/SaveTheDate';
import Venue from './components/Venue';
import { VenueVideoSection, VenueTourModal } from './components/VenueVideo';
import Wishes from './components/Wishes';
import Closing from './components/Closing';

const skipIntro = () => {
  try {
    return new URLSearchParams(window.location.search).get('intro') === '0';
  } catch {
    return false;
  }
};

export default function App() {
  const [introOpen, setIntroOpen] = useState(() => !skipIntro());
  const [tourOpen, setTourOpen] = useState(false);

  // lock page scroll while the opening is showing
  useEffect(() => {
    const el = document.documentElement;
    if (introOpen) {
      el.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      el.style.overflow = '';
    }
    return () => {
      el.style.overflow = '';
    };
  }, [introOpen]);

  const finishIntro = useCallback(() => setIntroOpen(false), []);
  const openTour = useCallback(() => setTourOpen(true), []);
  const closeTour = useCallback(() => setTourOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      {/* fixed royal-blue satin backdrop (an element, not background-attachment, for smooth iOS scrolling) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-midnight bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-satin.webp')", height: '100lvh', transform: 'translateZ(0)' }}
      />

      <main inert={introOpen ? true : undefined} aria-hidden={introOpen ? true : undefined}>
        <Hero ready={!introOpen} />
        <Families />
        <SaveTheDate />
        <Venue onOpenTour={openTour} />
        <VenueVideoSection onOpenTour={openTour} />
        <Wishes />
        <Closing />
      </main>

      <VenueTourModal open={tourOpen} onClose={closeTour} />

      <AnimatePresence>{introOpen && <Intro key="intro" onFinish={finishIntro} />}</AnimatePresence>
    </MotionConfig>
  );
}
