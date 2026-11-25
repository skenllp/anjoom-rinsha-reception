import { MapPin, Navigation, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { invitation } from '../data/invitation';
import { getDirectionsUrl, getLocationUrl } from '../lib/event';
import { EASE, Reveal, SectionHeading } from './ui';

export default function Venue({ onOpenTour }) {
  const { venue, media } = invitation;
  return (
    <section id="venue" className="relative px-4 py-20 sm:py-28">
      <SectionHeading eyebrow="Where we celebrate" title="The Celebration Venue" />

      <Reveal className="mx-auto mt-12 max-w-4xl" delay={0.05}>
        <figure className="overflow-hidden rounded-[1.75rem] border border-silver/30 shadow-[0_30px_70px_-25px_rgba(2,10,40,0.9)] ring-1 ring-white/10">
          <motion.img
            src={media.venuePhoto}
            alt="Khayaal Palace at golden hour — a white colonnaded entrance with warm lights and the venue sign above"
            width="1672"
            height="941"
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover sm:aspect-[16/9]"
            initial={{ scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, ease: EASE }}
          />
        </figure>
      </Reveal>

      <Reveal className="mt-9 text-center" delay={0.1}>
        <h3 className="font-display text-3xl font-medium tracking-[0.22em] text-ivory sm:text-4xl">{venue.name}</h3>
        <p className="mt-2 text-xl italic text-silver">
          {venue.locality}, {venue.region}
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-9 flex max-w-xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center" delay={0.15}>
        <a className="pill-btn" href={getLocationUrl()} target="_blank" rel="noopener noreferrer">
          <MapPin size={18} /> View Location
        </a>
        <a className="pill-btn" href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer">
          <Navigation size={18} /> Get Directions
        </a>
        <button type="button" className="pill-btn pill-btn--solid" onClick={onOpenTour}>
          <Play size={17} fill="currentColor" /> Watch Venue Tour
        </button>
      </Reveal>
    </section>
  );
}
