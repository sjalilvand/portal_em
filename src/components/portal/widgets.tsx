'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, icons } from 'lucide-react';
import { toast } from 'sonner';
import {
  formatPersianDate,
  formatPersianNumber,
  toPersianDigits,
} from '@/lib/settings';

/* ---------------- Dynamic lucide icon ---------------- */

export function PortalIcon({
  name,
  className,
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number | string;
}) {
  const Lucide = icons[name as keyof typeof icons] as React.ComponentType<{
    className?: string;
    size?: number | string;
  }>;
  if (!Lucide) return null;
  return <Lucide className={className} size={size} />;
}

/* ---------------- Section title ---------------- */

export function SectionTitle({
  eyebrow,
  title,
  desc,
  center,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-8 ${center ? 'text-center' : ''}`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-2">
          <span className="h-2 w-2 rounded-full bg-primary pulse-ring inline-block" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2>
      {desc && (
        <p className={`mt-3 text-muted-foreground leading-8 ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {desc}
        </p>
      )}
      <div className={`mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-primary to-accent ${center ? 'mx-auto' : ''}`} />
    </motion.div>
  );
}

/* ---------------- Animated counter ---------------- */

export function AnimatedCounter({
  value,
  suffix,
  duration = 1800,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatPersianNumber(display)}
      {suffix ? ` ${suffix}` : ''}
    </span>
  );
}

/* ---------------- Star rating ---------------- */

export function StarRating({
  newsId,
  avg,
  count,
  interactive = false,
  onRated,
  size = 16,
}: {
  newsId?: string;
  avg: number;
  count: number;
  interactive?: boolean;
  onRated?: (avg: number, count: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [localAvg, setLocalAvg] = useState(avg);
  const [localCount, setLocalCount] = useState(count);

  const shown = hover || Math.round(localAvg);

  async function rate(score: number) {
    if (!interactive || !newsId || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/news/${newsId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا');
      setLocalAvg(data.ratingAvg);
      setLocalCount(data.ratingCount);
      toast.success(`امتیاز شما ثبت شد: ${toPersianDigits(score)} از ۵`);
      onRated?.(data.ratingAvg, data.ratingCount);
    } catch {
      toast.error('ثبت امتیاز ناموفق بود');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5" dir="ltr">
      {[5, 4, 3, 2, 1].map((s) => (
        <button
          key={s}
          type="button"
          disabled={busy || !interactive}
          aria-label={`امتیاز ${s} از ۵`}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => rate(s)}
          className={`transition-transform ${interactive ? 'hover:scale-125 active:scale-95' : 'cursor-default'}`}
        >
          <Star
            size={size}
            className={
              s <= shown
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted-foreground/30'
            }
          />
        </button>
      ))}
      <span className="text-xs text-muted-foreground ms-1 whitespace-nowrap" dir="rtl">
        {toPersianDigits(localAvg.toFixed(1))} ({formatPersianNumber(localCount)})
      </span>
    </div>
  );
}

/* ---------------- Date badge ---------------- */

export function PersianDateBadge({ date }: { date: string }) {
  return (
    <time className="text-xs text-muted-foreground inline-flex items-center gap-1">
      {formatPersianDate(date)}
    </time>
  );
}

/* ---------------- Reveal wrapper ---------------- */

export function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Empty state ---------------- */

export function EmptyState({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-muted-foreground">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <p className="font-bold">{title}</p>
      {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
    </div>
  );
}
