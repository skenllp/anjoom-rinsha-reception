import { invitation } from '../data/invitation';
import { GlassCard, Reveal, SectionHeading } from './ui';

function Person({ role, relation, person }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="eyebrow text-[0.72rem]">{role}</p>
      <h3 className="mt-2 font-script text-[2.6rem] leading-[1.15] text-ivory sm:text-5xl">{person.name}</h3>
      <p className="mt-4 text-[1.05rem] italic text-silver">{relation.child}</p>
      <p className="mt-1 text-[1.3rem] font-medium leading-snug text-ivory">{person.parents}</p>
      <p className="eyebrow mt-6 text-[0.68rem]">{relation.grand}</p>
      <div className="mt-2 space-y-1">
        {person.grandparents.map((g) => (
          <p key={g} className="text-[1.15rem] leading-relaxed text-ivory/90">{g}</p>
        ))}
      </div>
    </div>
  );
}

/** Thin line – small four-point star – thin line. */
function StarDivider() {
  return (
    <div className="my-10 flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-silver/80 sm:w-24" />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="#F5F5F2">
        <path d="M8 0c.6 4.2 1.8 6.4 8 8-6.2 1.6-7.4 3.8-8 8-.6-4.2-1.8-6.4-8-8 6.2-1.6 7.4-3.8 8-8z" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-silver/80 sm:w-24" />
    </div>
  );
}

export default function Families() {
  const { couple } = invitation;
  return (
    <section id="families" className="relative px-3 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="With love & gratitude" title="Our Families" />
      <Reveal className="mx-auto mt-12 max-w-xl">
        <GlassCard innerClassName="px-4 py-12 sm:px-10 sm:py-14">
          <Person role="The Groom" relation={{ child: 'son of', grand: 'Grandson of' }} person={couple.groom} />
          <StarDivider />
          <Person role="The Bride" relation={{ child: 'daughter of', grand: 'Granddaughter of' }} person={couple.bride} />
        </GlassCard>
      </Reveal>
    </section>
  );
}
