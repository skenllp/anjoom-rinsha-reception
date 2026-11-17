import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { invitation } from '../data/invitation';
import { diffParts, downloadIcs, getTargetMs, googleCalendarUrl, hasEventTime } from '../lib/event';
import { Reveal, SectionHeading } from './ui';

function useCountdown(targetMs) {
  const [parts, setParts] = useState(() => diffParts(targetMs));
  useEffect(() => {
    const tick = () => setParts(diffParts(targetMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return parts;
}

const Cell = ({ value, label }) => (
  <div className="flex flex-col items-center rounded-2xl border border-silver/35 bg-gradient-to-b from-white/[0.1] to-white/[0.03] px-1 py-4 backdrop-blur-[2px] sm:py-6">
    <span className="font-display text-[2rem] font-medium leading-none tabular-nums text-ivory sm:text-5xl" aria-hidden="true">
      {String(value).padStart(2, '0')}
    </span>
    <span className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-silver sm:text-xs">{label}</span>
  </div>
);

export default function SaveTheDate() {
  const target = useMemo(getTargetMs, []);
  const { days, hours, minutes, seconds, done } = useCountdown(target);
  const timeSet = hasEventTime();

  return (
    <section id="save-the-date" className="relative px-4 py-20 sm:py-28">
      <SectionHeading eyebrow="Save the Date" title={invitation.event.displayDate} />

      <div className="mx-auto mt-12 max-w-xl">
        <Reveal>
          {done ? (
            <p className="text-center font-script text-4xl text-ivory">The celebration has begun — Alhamdulillah</p>
          ) : (
            <div
              role="timer"
              aria-label={`Time remaining: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
              className="grid grid-cols-4 gap-2 sm:gap-4"
            >
              <Cell value={days} label="Days" />
              <Cell value={hours} label="Hours" />
              <Cell value={minutes} label="Minutes" />
              <Cell value={seconds} label="Seconds" />
            </div>
          )}
        </Reveal>

        <Reveal delay={0.15} className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-[0.95rem] italic text-silver">
            {timeSet ? 'Counting down to the reception · India Standard Time' : 'Counting down to the day · India Standard Time'}
          </p>
          {timeSet ? (
            <div className="flex flex-wrap justify-center gap-3">
              <a className="pill-btn" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">
                <CalendarPlus size={18} /> Add to Calendar
              </a>
              <button type="button" className="pill-btn" onClick={downloadIcs}>
                Download .ics
              </button>
            </div>
          ) : (
            <p className="max-w-xs text-[1rem] text-ivory/80">The reception time will be shared with you soon, in shaa Allah.</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
