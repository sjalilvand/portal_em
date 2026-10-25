'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  HandHeart,
  Heart,
  MapPin,
  Newspaper,
  Sparkles,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  HERO_SLIDES,
  SERVICES,
  STATS,
  type ViewName,
} from '@/lib/portal-data';
import { toPersianDigits, formatPersianDate } from '@/lib/settings';
import {
  AnimatedCounter,
  PortalIcon,
  SectionTitle,
  StarRating,
  Reveal,
} from '@/components/portal/widgets';

/* ---------------- Nav interface ---------------- */

export interface SectionNav {
  go: (view: ViewName, params?: Record<string, string>) => void;
}

/* ---------------- Hero slider ---------------- */

export function HeroSlider({ nav }: { nav: SectionNav }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const DURATION = 7000;
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const slideTo = useCallback((i: number) => {
    setIndex(((i % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
    startRef.current = performance.now();
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = (now - startRef.current) / DURATION;
      if (p >= 1) {
        slideTo(index + 1);
        return;
      }
      setProgress(p);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index, paused, slideTo]);

  const slide = HERO_SLIDES[index];

  return (
    <section
      className="relative overflow-hidden"
      aria-label="اسلایدر معرفی"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[520px] sm:h-[560px] lg:h-[620px] hero-gradient">
        {/* Background image with kenburns */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0"
          >
            
            <img
              src={slide.image}
              alt={slide.title}
              className="kenburns h-full w-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/45 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                  <Sparkles size={14} className="text-amber-300" />
                  {slide.badge}
                </span>
                <h1 className="text-3xl font-black leading-[1.35] text-white sm:text-4xl lg:text-5xl">
                  {slide.title}
                  <br />
                  <span className="text-gradient bg-gradient-to-l from-amber-300 to-emerald-300 bg-clip-text">
                    {slide.highlight}
                  </span>
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-8 text-white/85 sm:text-base">
                  {slide.subtitle}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => nav.go(slide.cta.view)}
                    className="gap-2 rounded-full bg-white text-emerald-900 shadow-xl hover:bg-amber-300 hover:text-emerald-950"
                  >
                    {slide.cta.label}
                    <ArrowLeft size={17} />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => nav.go('news')}
                    className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
                  >
                    آخرین اخبار
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-4 left-4 z-20 mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2" dir="ltr">
            <button
              onClick={() => slideTo(index - 1)}
              aria-label="اسلاید قبلی"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => slideTo(index + 1)}
              aria-label="اسلاید بعدی"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => slideTo(i)}
                aria-label={`اسلاید ${toPersianDigits(i + 1)}`}
                className="relative h-2 overflow-hidden rounded-full bg-white/30 transition-all"
                style={{ width: i === index ? 44 : 14 }}
              >
                {i === index && (
                  <span
                    className="absolute inset-y-0 right-0 bg-amber-300 rounded-full"
                    style={{ width: `${progress * 100}%` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="pointer-events-none absolute left-6 top-24 z-10 hidden lg:block float-y">
        <div className="glass rounded-2xl border border-white/25 p-4 text-white shadow-xl">
          <p className="flex items-center gap-2 text-sm font-black">
            <HandHeart size={18} className="text-amber-300" /> ۹.۲ میلیون نیکوکار
          </p>
          <p className="mt-1 text-[11px] opacity-80">در کنار شما ایستاده‌اند</p>
        </div>
      </div>
      <div className="pointer-events-none absolute left-14 bottom-32 z-10 hidden lg:block float-y" style={{ animationDelay: '1.5s' }}>
        <div className="glass rounded-2xl border border-white/25 p-4 text-white shadow-xl">
          <p className="flex items-center gap-2 text-sm font-black">
            <Heart size={18} className="text-rose-300" /> ۵۱۷ هزار حامی اکرام
          </p>
          <p className="mt-1 text-[11px] opacity-80">امیدوارترین خانواده ایران</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Quick services ---------------- */

const SERVICE_COLORS: Record<string, string> = {
  rose: 'from-rose-500 to-pink-600',
  amber: 'from-amber-500 to-orange-600',
  pink: 'from-pink-500 to-rose-600',
  emerald: 'from-emerald-500 to-teal-600',
  sky: 'from-sky-500 to-blue-600',
  teal: 'from-teal-500 to-cyan-600',
  orange: 'from-orange-500 to-red-500',
  lime: 'from-lime-500 to-green-600',
  green: 'from-green-500 to-emerald-600',
  yellow: 'from-yellow-500 to-amber-600',
  violet: 'from-violet-500 to-purple-600',
};

export function QuickServices({ nav }: { nav: SectionNav }) {
  return (
    <section className="relative z-20 mx-auto -mt-14 max-w-7xl px-4" aria-label="خدمات سریع">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SERVICES.slice(0, 6).map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => nav.go('services', { service: s.id })}
            className="group rounded-2xl border bg-card p-4 text-center shadow-lg shadow-black/5 card-hover gradient-border"
          >
            <span
              className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6 ${SERVICE_COLORS[s.color] || 'from-emerald-500 to-teal-600'}`}
            >
              <PortalIcon name={s.icon} size={22} />
            </span>
            <p className="text-[13px] font-bold leading-6">{s.title}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              {s.online ? 'درگاه آنلاین' : 'حضوری/اعتبارسنجی'}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */

export function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14" aria-label="آمار کمیته امداد">
      <SectionTitle
        center
        eyebrow="آمار و عملکرد"
        title="امداد در یک نگاه"
        desc="عملکرد کمیته امداد امام خمینی (ره) با تکیه بر مشارکت بیش از ۹ میلیون نیکوکار ایرانی؛ عددها را لمس کنید."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 to-accent/5 card-hover">
              <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-xl transition-all group-hover:bg-primary/20" />
              <CardContent className="p-4 text-center">
                <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PortalIcon name={s.icon} size={20} />
                </span>
                <p className="text-lg font-black text-primary sm:text-xl">
                  <AnimatedCounter value={s.value} />
                </p>
                <p className="mt-1 text-[11px] font-bold text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
