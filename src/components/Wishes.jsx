import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { invitation } from '../data/invitation';
import { fetchApprovedWishes, submitWish, validateWish, wishesConfigured } from '../lib/wishes';
import { GlassCard, Reveal, SectionHeading } from './ui';

const COOLDOWN_KEY = 'wish-last-sent';

function WishCarousel() {
  const [wishes, setWishes] = useState([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!wishesConfigured) return undefined;
    const ctrl = new AbortController();
    fetchApprovedWishes(12, ctrl.signal)
      .then((rows) => setWishes(Array.isArray(rows) ? rows : []))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    if (wishes.length < 2) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % wishes.length), 7000);
    return () => clearInterval(id);
  }, [wishes.length]);

  if (!wishes.length) return null;
  const w = wishes[i % wishes.length];
  return (
    <div className="mx-auto mt-14 max-w-xl text-center" aria-roledescription="carousel" aria-label="Wishes from our guests">
      <p className="eyebrow mb-5">Blessings received</p>
      <div className="min-h-[9rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={w.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[1.3rem] italic leading-snug text-ivory">“{w.message}”</p>
            <footer className="mt-3 font-script text-2xl text-silver">— {w.name}</footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      {wishes.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {wishes.map((x, idx) => (
            <button
              key={x.id}
              type="button"
              aria-label={`Show wish ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${idx === i % wishes.length ? 'w-6 bg-ivory' : 'w-2 bg-silver/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const fieldCls =
  'w-full rounded-xl border border-silver/45 bg-midnight/45 px-4 py-3 text-[1.1rem] text-ivory placeholder:text-silver/60 outline-none transition focus:border-ivory focus:bg-midnight/60 focus:ring-2 focus:ring-silver/40';

export default function Wishes() {
  const { texts, wishes: cfg } = invitation;
  const [form, setForm] = useState({ name: '', message: '', website: '' }); // `website` = honeypot
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
    if (status === 'error' || status === 'success') setStatus('idle');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!wishesConfigured || status === 'sending') return;
    if (form.website) return; // bot
    const errs = validateWish(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
      if (Date.now() - last < 20000) {
        setStatus('error');
        setErrors({ form: 'Please wait a few seconds before sending another wish.' });
        return;
      }
    } catch {
      /* storage unavailable — ignore */
    }

    setStatus('sending');
    try {
      await submitWish({ name: form.name.trim(), message: form.message.trim() });
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
      setForm({ name: '', message: '', website: '' });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrors({ form: 'We could not send your wish just now. Please check your connection and try again.' });
    }
  };

  return (
    <section id="blessings" className="relative px-3 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="Duas & wishes" title={texts.wishesHeading} />
      <Reveal className="mx-auto mt-6 max-w-md text-center text-[1.2rem] italic text-ivory/90">{texts.wishesSub}</Reveal>

      <Reveal className="mx-auto mt-10 max-w-xl" delay={0.1}>
        <GlassCard innerClassName="px-1 py-3 sm:px-4 sm:py-5">
          {!wishesConfigured && (
            <div role="status" className="mb-5 flex gap-3 rounded-xl border border-silver/40 bg-white/5 p-3 text-left text-[1rem] text-ivory/90">
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-silver" />
              <p>The wishes wall isn’t switched on yet, so messages can’t be saved right now. Please come back soon — or share your blessings with the family directly.</p>
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-5 text-left">
            <div>
              <label htmlFor="wish-name" className="mb-1.5 block text-sm font-semibold uppercase tracking-[0.18em] text-silver">
                Your name
              </label>
              <input
                id="wish-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={cfg.maxName + 20}
                value={form.name}
                onChange={set('name')}
                disabled={!wishesConfigured}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'err-name' : undefined}
                className={fieldCls}
                placeholder="e.g. Aisha & family"
              />
              {errors.name && <p id="err-name" className="mt-1.5 text-[0.95rem] text-[#ffd2d2]">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="wish-msg" className="mb-1.5 block text-sm font-semibold uppercase tracking-[0.18em] text-silver">
                Your wishes
              </label>
              <textarea
                id="wish-msg"
                name="message"
                rows={4}
                value={form.message}
                onChange={set('message')}
                disabled={!wishesConfigured}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'err-msg' : 'msg-count'}
                className={`${fieldCls} resize-none`}
                placeholder="Write your prayers and blessings…"
              />
              <div className="mt-1.5 flex justify-between text-[0.9rem]">
                {errors.message ? <p id="err-msg" className="text-[#ffd2d2]">{errors.message}</p> : <span />}
                <span id="msg-count" className={form.message.length > cfg.maxMessage ? 'text-[#ffd2d2]' : 'text-silver/80'}>
                  {form.message.length}/{cfg.maxMessage}
                </span>
              </div>
            </div>

            {/* honeypot — hidden from people, tempting to bots */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
              </label>
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.p key="ok" role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 rounded-xl border border-emerald-200/40 bg-emerald-200/10 p-3 text-ivory">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-200" />
                  <span>JazakAllah Khair! Your blessings have been received and will appear on this page once approved.</span>
                </motion.p>
              )}
              {status === 'error' && errors.form && (
                <motion.p key="err" role="alert" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 rounded-xl border border-red-200/40 bg-red-200/10 p-3 text-ivory">
                  <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-200" />
                  <span>{errors.form}</span>
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex justify-center pt-1">
              <motion.button
                type="submit"
                disabled={!wishesConfigured || status === 'sending'}
                whileTap={{ scale: 0.97 }}
                className="pill-btn pill-btn--solid w-full sm:w-auto sm:min-w-[220px]"
              >
                {status === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
                {status === 'sending' ? 'Sending…' : 'Send Wishes'}
              </motion.button>
            </div>
          </form>
        </GlassCard>
      </Reveal>

      <WishCarousel />
    </section>
  );
}
