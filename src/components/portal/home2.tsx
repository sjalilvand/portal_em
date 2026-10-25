'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Eye,
  Flame,
  HandHeart,
  HelpCircle,
  MapPin,
  Newspaper,
  Play,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  MEDIA_CATEGORIES,
  ORG_UNITS,
  PROVINCES,
  FAQ_ITEMS,
  type ViewName,
} from '@/lib/portal-data';
import { toPersianDigits, formatPersianNumber, formatPersianDate } from '@/lib/settings';
import {
  EmptyState,
  PortalIcon,
  Reveal,
  SectionTitle,
  StarRating,
} from '@/components/portal/widgets';

/* ---------------- News item type (light) ---------------- */

export interface NewsCardItem {
  id: string;
  title: string;
  excerpt: string;
  image: string | null;
  category: string;
  province: string | null;
  views: number;
  featured: boolean;
  createdAt: string;
  ratingAvg: number;
  ratingCount: number;
}

/* ---------------- Help CTA ---------------- */

export function HelpCTA({ nav }: { nav: { go: (v: ViewName, p?: Record<string, string>) => void } }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14" aria-label="می‌خواهم کمک کنم">
      <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 sm:p-12">
        <div className="dots-pattern absolute inset-0 opacity-60" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div className="text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur">
              <HandHeart size={14} /> مشارکت الکترونیکی
            </span>
            <h2 className="mt-4 text-2xl font-black leading-relaxed sm:text-3xl">
              می‌خواهم کمک کنم؛
              <br />
              قطره‌ای از دریای مهربانی باشید
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-8 opacity-90">
              پذیرش حامی طرح اکرام، پرداخت صدقه و نذر، زکات و کفاره و کمک‌های عام؛ همه به صورت آنلاین، شفاف و با گزارش عملکرد دقیق. با چند کلیک، زندگی یک خانواده را متحول کنید.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => nav.go('help', { tab: 'sponsor' })}
                className="rounded-full bg-white text-emerald-900 shadow-xl hover:bg-amber-300"
              >
                پذیرش حامی
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => nav.go('help', { tab: 'donate' })}
                className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                واریز آنلاین کمک
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'HeartHandshake', title: 'پذیرش حامی', desc: 'کودک، خانواده یا سالمند', tab: 'sponsor' },
              { icon: 'HandCoins', title: 'صدقه و نذر', desc: 'پرداخت آنی با کد QR', tab: 'donate' },
              { icon: 'Scale', title: 'زکات و کفاره', desc: 'محاسبه‌گر آنلاین', tab: 'donate' },
              { icon: 'Gift', title: 'اهدای جهیزیه', desc: 'بازسازی زندگی جوانان', tab: 'sponsor' },
            ].map((c, i) => (
              <motion.button
                key={c.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => nav.go('help', { tab: c.tab })}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 text-right text-primary-foreground backdrop-blur transition-all hover:scale-[1.03] hover:bg-white/20"
              >
                <PortalIcon name={c.icon} size={24} className="mb-2 text-amber-300" />
                <p className="text-sm font-black">{c.title}</p>
                <p className="mt-1 text-[11px] opacity-80">{c.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- News preview ---------------- */

export function NewsPreview({
  items,
  nav,
  loading,
}: {
  items: NewsCardItem[];
  nav: { go: (v: ViewName, p?: Record<string, string>) => void };
  loading?: boolean;
}) {
  return (
    <section className="bg-muted/40 py-14" aria-label="آخرین اخبار">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle
            eyebrow="پایگاه اطلاع‌رسانی"
            title="آخرین اخبار و اطلاعیه‌ها"
            desc="رویدادها، عملکردها و اطلاعیه‌های کمیته امداد با قابلیت امتیازدهی شما به هر خبر"
          />
          <Button variant="outline" onClick={() => nav.go('news')} className="mb-8 gap-2 rounded-full">
            مشاهده همه اخبار <Newspaper size={16} />
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-44 shimmer bg-muted" />
                <CardContent className="space-y-3 p-5">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-4/5 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="خبری یافت نشد" desc="به زودی اخبار جدیدی اضافه می‌شود" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((n, i) => (
              <Reveal key={n.id} delay={i * 0.06}>
                <Card
                  className="group h-full cursor-pointer overflow-hidden card-hover gradient-border"
                  onClick={() => nav.go('news', { id: n.id })}
                >
                  <div className="relative h-44 overflow-hidden">
                    {n.image ? (
                       
                      <img
                        src={n.image}
                        alt={n.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center hero-gradient">
                        <Newspaper size={40} className="text-white/70" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {n.featured && (
                      <Badge className="absolute right-3 top-3 gap-1 bg-amber-500 text-white shadow">
                        <Flame size={12} /> ویژه
                      </Badge>
                    )}
                    <Badge variant="secondary" className="absolute bottom-3 right-3 backdrop-blur">
                      {n.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="line-clamp-2 min-h-[3.4rem] text-[15px] font-bold leading-7 transition-colors group-hover:text-primary">
                      {n.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-muted-foreground">{n.excerpt}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                      <StarRating avg={n.ratingAvg} count={n.ratingCount} size={14} />
                      <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Eye size={13} /> {formatPersianNumber(n.views)}
                        <span>·</span>
                        {formatPersianDate(n.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Multimedia preview ---------------- */

export function MultimediaPreview({ nav }: { nav: { go: (v: ViewName, p?: Record<string, string>) => void } }) {
  const cats = MEDIA_CATEGORIES.slice(0, 5);
  return (
    <section className="mx-auto max-w-7xl px-4 py-14" aria-label="چندرسانه‌ای">
      <SectionTitle
        eyebrow="چندرسانه‌ای"
        title="گزارش‌های تصویری و رسانه"
        desc="گزارش تصویری، تیزر، مستند، موشن‌گرافی و پادکست‌های کمیته امداد"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cats.map((c, i) => (
          <Reveal key={c.key} delay={i * 0.05}>
            <button
              onClick={() => nav.go('multimedia', { cat: c.key })}
              className="group relative block h-36 w-full overflow-hidden rounded-2xl border shadow-md card-hover"
            >
              <span className="absolute inset-0 hero-gradient opacity-95 transition-transform duration-500 group-hover:scale-110" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-transform group-hover:scale-125">
                  <PortalIcon name={c.icon} size={20} />
                </span>
                <span className="text-sm font-black">{c.label}</span>
                <span className="text-[10px] opacity-80">{toPersianDigits(c.items.length)} محتوا</span>
              </span>
              <span className="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-l from-amber-300 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Provinces marquee ---------------- */

export function ProvincesMarquee({ nav }: { nav: { go: (v: ViewName, p?: Record<string, string>) => void } }) {
  const doubled = [...PROVINCES, ...PROVINCES];
  return (
    <section className="overflow-hidden bg-muted/40 py-12" aria-label="پایگاه‌های استانی">
      <div className="mx-auto mb-6 max-w-7xl px-4">
        <SectionTitle
          center
          eyebrow="پایگاه‌های استانی"
          title="حضور در ۳۱ استان کشور"
          desc="دفاتر کمیته امداد در تمام استان‌های کشور آماده خدمت‌رسانی هستند؛ استان خود را انتخاب کنید."
        />
      </div>
      <div className="relative" dir="ltr">
        <div className="marquee-track flex w-max gap-3" style={{ animationDirection: 'reverse' }}>
          {doubled.map((p, i) => (
            <button
              key={`${p}-${i}`}
              onClick={() => nav.go('provinces', { province: p })}
              dir="rtl"
              className="flex shrink-0 items-center gap-2 rounded-full border bg-card px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
            >
              <MapPin size={14} className="text-primary" />
              {p}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}

/* ---------------- Org structure ---------------- */

export function OrgSection() {
  const [active, setActive] = useState<number>(0);
  return (
    <section className="mx-auto max-w-7xl px-4 py-14" aria-label="ساختار سازمانی">
      <SectionTitle
        eyebrow="ساختار سازمانی"
        title="معاونت‌ها و ادارات کل"
        desc="ساختار ستاد مرکزی کمیته امداد امام خمینی (ره)"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ORG_UNITS.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.04}>
            <button
              onMouseEnter={() => setActive(i)}
              className={`w-full rounded-2xl border bg-card p-5 text-right card-hover gradient-border transition-all ${active === i ? 'border-primary/50 shadow-lg shadow-primary/10' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${active === i ? 'hero-gradient text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                  <PortalIcon name={o.icon} size={20} />
                </span>
                <div>
                  <p className="text-sm font-black leading-6">{o.title}</p>
                  <p className="mt-1.5 text-xs leading-6 text-muted-foreground">{o.desc}</p>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

export function FaqSection({ nav }: { nav: { go: (v: ViewName, p?: Record<string, string>) => void } }) {
  return (
    <section className="bg-muted/40 py-14" aria-label="سوالات متداول">
      <div className="mx-auto max-w-4xl px-4">
        <SectionTitle
          center
          eyebrow="سوالات متداول"
          title="پاسخ پرسش‌های رایج شما"
          desc="اگر پاسخ پرسش خود را پیدا نکردید، از طریق مرکز تماس ۱۴۹۸ با ما در ارتباط باشید."
        />
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.slice(0, 5).map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-2xl border bg-card px-5 shadow-sm data-[state=open]:border-primary/40"
            >
              <AccordionTrigger className="py-4 text-right text-sm font-bold hover:no-underline [&>svg]:shrink-0">
                <span className="flex items-center gap-2">
                  <HelpCircle size={16} className="shrink-0 text-primary" />
                  {f.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-[13px] leading-7 text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => nav.go('faq')} className="rounded-full gap-2">
            مشاهده همه سوالات <ChevronDown size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
