import { motion } from 'framer-motion';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { invitation } from '../data/invitation';
import { formatEventTime } from '../lib/event';
import { EASE, FloralCorners, GlassCard } from './ui';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.28, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } },
};

function Rule() {
  return <span className="h-px flex-1 bg-gradient-to-r from-transparent via-silver/70 to-silver/70" />;
}

export default function Hero({ ready }) {
  const { couple, event, venue, texts, hosts } = invitation;
  return (
    <section id="invitation" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-2.5 py-14 sm:px-6">
      <GlassCard className="w-full max-w-[480px] sm:max-w-[540px]" innerClassName="px-2 py-5 sm:px-5 sm:py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          className="flex flex-col items-center text-center"
        >
          <motion.p variants={item} lang="ar" dir="rtl" className="font-arabic text-[1.85rem] leading-[1.6] text-ivory sm:text-4xl">
            {texts.bismillah}
          </motion.p>

          <motion.p variants={item} className="mt-3 max-w-[19rem] sm:max-w-[26rem] text-[1.08rem] italic leading-snug text-ivory/95 sm:text-xl">
            {texts.invite}
          </motion.p>

          <motion.div variants={item} className="mt-5 flex w-full items-center gap-3 sm:gap-4">
            <Rule />
            <h1 className="font-display text-[0.95rem] font-medium tracking-[0.32em] text-ivory sm:text-lg">
              {texts.receptionOf}
            </h1>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-silver/70 to-silver/70" />
          </motion.div>

          <motion.p variants={item} className="mt-1 font-script text-[2.7rem] leading-[1.15] text-ivory sm:text-[3.6rem]">
            {couple.groom.name}
          </motion.p>
          <motion.p variants={item} className="font-display text-3xl leading-none text-ivory/90" aria-label="and">
            &amp;
          </motion.p>
          <motion.p variants={item} className="font-script text-[2.7rem] leading-[1.15] text-ivory sm:text-[3.6rem]">
            {couple.bride.name}
          </motion.p>

          <motion.div variants={item} className="mt-6 flex flex-col items-center gap-2 font-display text-[0.95rem] font-medium tracking-[0.12em] text-ivory sm:text-xl sm:tracking-[0.16em]">
            <p className="flex items-center gap-2 whitespace-nowrap">
              <CalendarDays size={17} strokeWidth={1.6} className="shrink-0 text-silver" aria-hidden="true" />
              <time dateTime={`${event.date.year}-${event.date.month}-${event.date.day}`}>{event.displayDate}</time>
            </p>
            {event.time && (
              <p className="flex items-center gap-2 whitespace-nowrap">
                <Clock size={17} strokeWidth={1.6} className="shrink-0 text-silver" aria-hidden="true" />
                <span>{formatEventTime()}</span>
              </p>
            )}
            <p className="flex items-center gap-2 whitespace-nowrap">
              <MapPin size={17} strokeWidth={1.6} className="shrink-0 text-silver" aria-hidden="true" />
              <span>
                {venue.name}, {venue.locality.toUpperCase()}
              </span>
            </p>
          </motion.div>

          <motion.div variants={item} className="mt-6 w-full" aria-hidden="true">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-silver/80" />
              <svg width="30" height="20" viewBox="0 0 34 22" fill="#F5F5F2"><path d="M21 5c-1 5-4 8-9 9 1-4 4-7 9-9zM14 16c2-4 6-7 12-8-1 4-5 8-12 8z" /><path d="M3 18c8-1 14-5 18-13" stroke="#F5F5F2" strokeWidth="1.1" fill="none" strokeLinecap="round"/></svg>
              <span className="h-px w-20 bg-gradient-to-l from-transparent to-silver/80" />
            </div>
          </motion.div>

          <motion.div variants={item} className="mt-4">
            <p className="font-display text-base italic text-ivory/90 sm:text-lg">{texts.complimentsLabel}</p>
            <p className="mt-0.5 font-display text-[1.1rem] font-medium tracking-[0.2em] text-ivory sm:text-xl">{hosts}</p>
          </motion.div>
        </motion.div>
      </GlassCard>

      <FloralCorners size="clamp(250px, 66vw, 600px)" />

      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.3em] text-silver/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 3, duration: 1.5 }}
        aria-hidden="true"
      >
        Scroll
      </motion.div>
    </section>
  );
}
