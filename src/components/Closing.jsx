import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { invitation } from '../data/invitation';
import { shareInvitation } from '../lib/event';
import { Divider, FloralCorners, Reveal } from './ui';

export default function Closing() {
  const { couple, texts, hosts } = invitation;
  const [note, setNote] = useState('');

  const onShare = async () => {
    const r = await shareInvitation();
    setNote(r === 'whatsapp' ? 'Opening WhatsApp…' : r === 'shared' ? 'Shared — thank you!' : '');
    if (r !== 'cancelled') setTimeout(() => setNote(''), 3500);
  };

  return (
    <section id="closing" className="relative overflow-hidden px-6 pb-28 pt-24 text-center sm:pt-32" style={{ paddingBottom: 'max(7rem, calc(var(--safe-bottom) + 6rem))' }}>
      <div className="absolute inset-0 -z-0 bg-gradient-to-b from-transparent via-midnight/40 to-midnight/70" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-md">
        <Reveal>
          <p className="font-script text-[2.35rem] leading-[1.25] text-ivory sm:text-6xl">
            {couple.groom.name}
            <span className="my-1 block font-display text-3xl text-ivory/85">&amp;</span>
            {couple.bride.name}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Divider className="my-7" />
          <p className="font-display text-[1.5rem] italic text-ivory sm:text-3xl">“{texts.closingQuote}”</p>
        </Reveal>
        <Reveal delay={0.2} className="mt-9">
          <p className="font-display text-base italic text-silver sm:text-lg">{texts.complimentsLabel}</p>
          <p className="mt-1 font-display text-[1.3rem] font-medium tracking-[0.22em] text-ivory sm:text-2xl">{hosts}</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10 flex flex-col items-center gap-3">
          <button type="button" onClick={onShare} className="pill-btn">
            <Share2 size={18} /> Share Invitation
          </button>
          <p role="status" className="h-5 text-sm text-silver">{note}</p>
        </Reveal>
      </div>
      <FloralCorners size="clamp(230px, 60vw, 520px)" delay={0.2} />
    </section>
  );
}
