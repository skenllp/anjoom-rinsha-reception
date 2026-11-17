import { invitation } from '../data/invitation';
import { Divider, GlassCard, Reveal, SectionHeading } from './ui';

function Card({ role, relation, person, delay }) {
  const rel = relation;
  return (
    <Reveal delay={delay} className="h-full">
      <GlassCard className="h-full" innerClassName="flex flex-col items-center px-3 py-7 text-center sm:px-6 sm:py-9">
        <p className="eyebrow">{role}</p>
        <h3 className="mt-3 font-script text-[2.6rem] leading-[1.15] text-ivory sm:text-5xl">{person.name}</h3>
        <Divider className="my-5 scale-90" />
        <p className="text-[0.95rem] italic text-silver">{rel.child}</p>
        <p className="mt-1 text-[1.2rem] font-medium leading-snug text-ivory">{person.parents}</p>
        <p className="mt-5 text-[0.95rem] italic text-silver">{rel.grand}</p>
        <p className="mt-1 text-[1.2rem] font-medium leading-snug text-ivory">{person.grandparents}</p>
      </GlassCard>
    </Reveal>
  );
}

export default function Families() {
  const { couple } = invitation;
  return (
    <section id="families" className="relative px-3 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="With love & gratitude" title="Our Families" />
      <div className="mx-auto mt-12 grid max-w-4xl gap-10 sm:grid-cols-2 sm:gap-8">
        <Card role="The Groom" relation={{ child: 'Son of', grand: 'Grandson of' }} person={couple.groom} delay={0} />
        <Card role="The Bride" relation={{ child: 'Daughter of', grand: 'Granddaughter of' }} person={couple.bride} delay={0.15} />
      </div>
    </section>
  );
}
