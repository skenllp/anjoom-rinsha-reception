import { motion, useReducedMotion } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];

/** Scroll-triggered soft reveal. Use `delay` for staggering. */
export function Reveal({ children, delay = 0, y = 22, className = '', as = 'div', ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Thin silver divider with a small leaf sprig, echoing the printed invitation. */
export function Divider({ className = '', withLeaf = true }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-silver/80" />
      {withLeaf && (
        <svg width="34" height="22" viewBox="0 0 34 22" fill="none" stroke="#F5F5F2" strokeWidth="1.1" strokeLinecap="round">
          <path d="M3 18c8-1 14-5 18-13" />
          <path d="M21 5c-1 5-4 8-9 9 1-4 4-7 9-9z" fill="#F5F5F2" fillOpacity=".85" stroke="none" />
          <path d="M14 16c2-4 6-7 12-8-1 4-5 8-12 8z" fill="#F5F5F2" fillOpacity=".7" stroke="none" />
          <path d="M26 8c2 0 4-1 5-3" />
        </svg>
      )}
      <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-silver/80" />
    </div>
  );
}

/** Acrylic panel (uses Royal Blue Glass Panel.png as a 9-slice border-image). */
export function GlassCard({ children, className = '', innerClassName = '', ...rest }) {
  return (
    <div className={`glass-card ${className}`} {...rest}>
      <span className="glass-sheen" aria-hidden="true" />
      <div className={`relative z-10 ${innerClassName}`}>{children}</div>
    </div>
  );
}

/**
 * Corner vines cut from the supplied transparent floral overlay.
 * The source art holds a top-left and a bottom-right vine; each is cropped into a tight box
 * so it can be positioned/animated independently. Never intercepts touches.
 */
export function FloralCorners({ size = 'clamp(240px, 64vw, 560px)', tl = true, br = true, delay = 0.4, className = '' }) {
  const reduce = useReducedMotion();
  const sway = (from, to, dur, origin) =>
    reduce
      ? {}
      : {
          animate: { rotate: [from, to, from] },
          transition: { duration: dur, repeat: Infinity, ease: 'easeInOut' },
          style: { transformOrigin: origin },
        };
  const imgStyle = { width: size, maxWidth: 'none', height: 'auto' };
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {tl && (
        <motion.div
          className="absolute left-0 top-0 overflow-hidden"
          style={{ width: `calc(${size} * 0.33)`, height: `calc(${size} * 0.74)`, transformOrigin: '0 0' }}
          initial={{ opacity: 0, x: -20, y: -20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE, delay }}
        >
          <motion.img
            src="/images/floral.webp"
            alt=""
            width="1024"
            height="1536"
            loading="lazy"
            decoding="async"
            style={{ ...imgStyle, ...sway(-1.2, 1.4, 9, '0% 0%').style }}
            {...(reduce ? {} : { animate: sway(-1.2, 1.4, 9).animate, transition: sway(-1.2, 1.4, 9).transition })}
          />
        </motion.div>
      )}
      {br && (
        <motion.div
          className="absolute bottom-0 right-0 overflow-hidden"
          style={{ width: `calc(${size} * 0.34)`, height: `calc(${size} * 0.77)` }}
          initial={{ opacity: 0, x: 20, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE, delay: delay + 0.2 }}
        >
          <motion.img
            src="/images/floral.webp"
            alt=""
            width="1024"
            height="1536"
            loading="lazy"
            decoding="async"
            className="absolute bottom-0 right-0"
            style={{ ...imgStyle, transformOrigin: '100% 100%' }}
            {...(reduce ? {} : { animate: { rotate: [1.2, -1.4, 1.2] }, transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' } })}
          />
        </motion.div>
      )}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, className = '' }) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-[2rem] sm:text-5xl font-medium tracking-wide text-ivory">{title}</h2>
      <Divider className="mt-5" />
    </div>
  );
}
