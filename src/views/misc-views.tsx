'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Play,
  Send,
  ShieldCheck,
  Target,
  Eye as EyeIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import {
  CONTACT_INFO,
  FAQ_ITEMS,
  MEDIA_CATEGORIES,
  ORG_UNITS,
  PROVINCES,
  TRANSPARENCY_BARS,
} from '@/lib/portal-data';
import { formatPersianNumber, toPersianDigits } from '@/lib/settings';
import {
  AnimatedCounter,
  EmptyState,
  PortalIcon,
  Reveal,
  SectionTitle,
} from '@/components/portal/widgets';
import { cn } from '@/lib/utils';

export interface SimpleNav {
  go: (view: import('@/lib/portal-data').ViewName, params?: Record<string, string>) => void;
}

/* ================= About ================= */

export function AboutView({ nav }: { nav: SimpleNav }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionTitle
        eyebrow="معرفی"
        title="امداد در یک نگاه"
        desc="کمیته امداد امام خمینی (ره)؛ بزرگترین نهاد حمایتی کشور با بیش از چهار دهه خدمت‌رسانی به محرومان و نیازمندان"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="h-full border-0 shadow-lg">
            <CardContent className="space-y-4 p-6 text-[15px] leading-9">
              <p>
                کمیته امداد امام (ره) از جمله اولین نهادهایی است که پس از گذشت مدت کوتاهی از پیروزی انقلاب
                اسلامی ایران در ۱۴ اسفند ۱۳۵۷ با فرمان مبارک رهبر فقید انقلاب اسلامی، حضرت امام خمینی (ره)
                و با هدف ساماندهی و رسیدگی به وضعیت معیشت و امور محرومان و نیازمندان کشور تأسیس شد.
              </p>
              <p>
                این نهاد با بیش از چهار دهه تجربه، امروز با استفاده از فناوری‌های نوین، هوش مصنوعی و مرکز
                پایش فقر، شناسایی هدفمند نیازمندان و ارائه بیش از ۱۷۰۰ قلم خدمت در حوزه‌های معیشت، سلامت،
                مسکن، اشتغال، تحصیل و امور فرهنگی را در سراسر کشور و حتی در سطح بین‌المللی بر عهده دارد.
              </p>
              <p>
                حرکت از «کمک معیشت» به سمت «توانمندسازی پایدار»، راهبرد اصلی کمیته امداد است؛ به گونه‌ای که
                خانواده‌های تحت حمایت با دریافت تسهیلات اشتغال، آموزش مهارت و حمایت‌های تحصیلی به استقلال
                اقتصادی برسند و خود در آینده به نیکوکاران جامعه تبدیل شوند.
              </p>
            </CardContent>
          </Card>
        </Reveal>

        <div className="space-y-4">
          {[
            { icon: Target, title: 'مأموریت ما', desc: 'فقرزدایی محترمانه و توانمندساز با مشارکت ملت' },
            { icon: EyeIcon, title: 'چشم‌انداز', desc: 'ایرانی بدون فقر مطلق با جامعه نیکوکار' },
            { icon: ShieldCheck, title: 'منشور اخلاقی', desc: 'حرمت مددجو، شفافیت، عدالت و کرامت انسانی' },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <Card className="card-hover gradient-border">
                <CardContent className="flex items-start gap-3 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <c.icon size={20} />
                  </span>
                  <div>
                    <p className="font-black">{c.title}</p>
                    <p className="mt-1 text-[13px] leading-7 text-muted-foreground">{c.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Stat highlights */}
      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        {[
          { v: 1404, label: 'سال تاسیس', raw: 1357 },
          { v: 31, label: 'استان تحت پوشش' },
          { v: 1700, label: 'قلم خدمت' },
          { v: 25, label: 'هزار مرکز خدمت' },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <Card className="text-center card-hover">
              <CardContent className="p-5">
                <p className="text-2xl font-black text-primary">
                  {s.raw ? toPersianDigits(s.raw) : <AnimatedCounter value={s.v} />}
                </p>
                <p className="mt-1 text-xs font-bold text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* Org structure */}
      <div className="mt-12">
        <SectionTitle eyebrow="ساختار سازمانی" title="معاونت‌ها و ادارات کل ستاد مرکزی" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ORG_UNITS.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.04}>
              <div className="flex h-full items-start gap-3 rounded-2xl border bg-card p-4 card-hover">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PortalIcon name={o.icon} size={18} />
                </span>
                <div>
                  <p className="text-[13px] font-black leading-6">{o.title}</p>
                  <p className="mt-1 text-[11px] leading-6 text-muted-foreground">{o.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= Provinces ================= */

export function ProvincesView({ nav, initialProvince }: { nav: SimpleNav; initialProvince?: string }) {
  const [selected, setSelected] = useState<string | null>(initialProvince || null);
  const [q, setQ] = useState('');

  const filtered = PROVINCES.filter((p) => p.includes(q.trim()));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionTitle
        eyebrow="پایگاه‌های استانی"
        title="کمیته امداد در ۳۱ استان"
        desc="هر استان دارای اداره کل مستقل با دفاتر شهرستانی و مراکز نیکوکاری است. روی استان موردنظر کلیک کنید تا اخبار آن را ببینید."
      />

      <div className="mb-6 flex items-center gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجوی استان..."
          className="max-w-xs rounded-xl"
        />
        <span className="text-xs text-muted-foreground">
          {toPersianDigits(filtered.length)} استان
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p, i) => (
          <Reveal key={p} delay={i * 0.02}>
            <button
              onClick={() => { setSelected(p); nav.go('news', { province: p }); }}
              className="group relative h-28 w-full overflow-hidden rounded-2xl border bg-card p-4 text-right shadow-sm card-hover gradient-border"
            >
              <span className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-primary/10 blur-lg transition-all group-hover:bg-primary/25" />
              <MapPin size={18} className="text-primary" />
              <p className="mt-3 text-sm font-black leading-6">{p}</p>
              <p className="mt-1 text-[11px] text-muted-foreground group-hover:text-primary">
                مشاهده اخبار استان <ArrowRight size={12} className="inline rotate-180" />
              </p>
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= Multimedia ================= */

export function MultimediaView({ initialCat }: { initialCat?: string }) {
  const [cat, setCat] = useState(initialCat || MEDIA_CATEGORIES[0].key);
  const active = MEDIA_CATEGORIES.find((c) => c.key === cat) || MEDIA_CATEGORIES[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <SectionTitle
        eyebrow="چندرسانه‌ای"
        title="رسانه‌های کمیته امداد"
        desc="گزارش تصویری، رسانه ملی، اینفوگرافی، تیزر، مستند، موشن‌گرافی و پادکست"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {MEDIA_CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition-all',
              cat === c.key
                ? 'hero-gradient border-transparent text-primary-foreground shadow-md'
                : 'bg-card hover:border-primary/50'
            )}
          >
            <PortalIcon name={c.icon} size={15} />
            {c.label}
          </button>
        ))}
      </div>

      <motion.div
        key={cat}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {active.items.map((m, i) => (
          <Card key={m.title} className="group cursor-pointer overflow-hidden card-hover">
            <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${m.gradient}`}>
              <span className="dots-pattern absolute inset-0 opacity-40" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-transform duration-300 group-hover:scale-125">
                <Play size={22} className="fill-white text-white" />
              </span>
              <Badge variant="secondary" className="absolute bottom-3 right-3 backdrop-blur">
                {active.label}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="line-clamp-2 min-h-[3rem] text-sm font-bold leading-7">{m.title}</h3>
              <p className="mt-2 text-[11px] text-muted-foreground">{m.date}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}

/* ================= FAQ page ================= */

export function FaqView() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <SectionTitle
        center
        eyebrow="سوالات متداول"
        title="بانک سوالات متداول"
        desc="پاسخ پرتکرارترین پرسش‌های شما درباره خدمات کمیته امداد"
      />
      <Accordion type="single" collapsible className="space-y-3">
        {FAQ_ITEMS.map((f, i) => (
          <AccordionItem
            key={i}
            value={`faqpage-${i}`}
            className="rounded-2xl border bg-card px-5 shadow-sm data-[state=open]:border-primary/40"
          >
            <AccordionTrigger className="py-4 text-right text-sm font-bold hover:no-underline">
              <span className="flex items-center gap-2">
                <FileText size={16} className="shrink-0 text-primary" />
                {f.q}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-[13px] leading-7 text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/* ================= Contact ================= */

export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      const { toast } = await import('sonner');
      toast.error('نام و متن پیام الزامی است');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setName(''); setEmail(''); setMessage('');
    const { toast } = await import('sonner');
    toast.success('پیام شما با موفقیت ثبت شد. کد پیگیری: ' + toPersianDigits(Math.floor(100000 + Math.random() * 899999)));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionTitle
        eyebrow="ارتباط با ما"
        title="پاسخگوی شما هستیم"
        desc="پیشنهاد، انتقاد و درخواست کمک خود را ثبت کنید؛ درخواست‌ها در سامانه سامد پیگیری می‌شود."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: MapPin, title: 'نشانی', value: CONTACT_INFO.address },
            { icon: Phone, title: 'مرکز تماس ۲۴ ساعته', value: CONTACT_INFO.phone },
            { icon: Mail, title: 'پست الکترونیک', value: CONTACT_INFO.email },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <Card className="card-hover gradient-border">
                <CardContent className="flex items-start gap-3 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <c.icon size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-black">{c.title}</p>
                    <p className="mt-1 text-[13px] leading-7 text-muted-foreground">{c.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <div className="relative h-48 overflow-hidden rounded-3xl border shadow-md">
              <div className="absolute inset-0 bg-muted dots-pattern" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <MapPin size={28} className="text-primary" />
                <p className="text-sm font-black">دفتر مرکزی کمیته امداد</p>
                <p className="text-[11px] text-muted-foreground">تهران، میدان آزادی</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="c-name">نام و نام خانوادگی *</Label>
                    <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="c-email">ایمیل یا موبایل</Label>
                    <Input id="c-email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-msg">متن پیام *</Label>
                  <Textarea
                    id="c-msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="پیشنهاد، انتقاد یا درخواست کمک خود را بنویسید..."
                    className="min-h-36 rounded-xl"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full gap-2 rounded-2xl">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  ارسال پیام
                </Button>
              </form>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

/* ================= Transparency ================= */

export function TransparencyView() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionTitle
        eyebrow="سامانه شفافیت"
        title="گزارش شفاف هزینه‌کرد و بودجه"
        desc="گزارش تفریغ بودجه و سهم هر حوزه از اعتبارات به صورت آنلاین و قابل استناد ارائه می‌شود."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <Card className="border-0 shadow-lg">
            <CardContent className="space-y-5 p-6">
              <p className="text-sm font-black">توزیع اعتبارات در حوزه‌های خدماتی</p>
              {TRANSPARENCY_BARS.map((b, i) => (
                <div key={b.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold">{b.label}</span>
                    <span className="text-muted-foreground">{toPersianDigits(b.value)}٪</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
                    className={cn(
                      'h-3 rounded-full bg-gradient-to-l',
                      b.color === 'primary' && 'from-primary/80 to-primary',
                      b.color === 'accent' && 'from-accent/80 to-accent',
                      b.color === 'chart2' && 'from-emerald-500/70 to-emerald-600',
                      b.color === 'chart3' && 'from-sky-500/70 to-sky-600',
                      b.color === 'chart4' && 'from-fuchsia-500/70 to-fuchsia-600',
                      b.color === 'chart5' && 'from-amber-500/70 to-amber-600'
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </Reveal>

        <div className="space-y-4 lg:col-span-2">
          {[
            { title: 'گزارش عملکرد پنج‌ساله', desc: 'خلاصه خدمات ارائه‌شده طی ۵ سال اخیر', icon: 'BarChart3' },
            { title: 'گزارش طرح صدقات', desc: 'عملکرد صدقات و محل هزینه‌کرد', icon: 'HandCoins' },
            { title: 'اینفوگرافیک مددجویان', desc: 'آمار خانوارها و مددجویان تحت حمایت', icon: 'Users' },
            { title: 'مراکز نیکوکاری', desc: 'فهرست و عملکرد مراکز نیکوکاری کشور', icon: 'Building2' },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <Card className="cursor-pointer card-hover gradient-border">
                <CardContent className="flex items-center gap-3 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <PortalIcon name={c.icon} size={20} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-black">{c.title}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{c.desc}</p>
                  </div>
                  <ArrowRight size={16} className="rotate-180 text-primary" />
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
