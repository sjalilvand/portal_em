'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Play,
  Scale,
  Send,
  ShieldCheck,
  Target,
  Users,
  Eye as EyeIcon,
  ScrollText,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  CONTACT_INFO,
  FAQ_ITEMS,
  MEDIA_CATEGORIES,
  ORG_UNITS,
  PROVINCES,
} from '@/lib/portal-data';
import { toPersianDigits } from '@/lib/settings';
import {
  AnimatedCounter,
  PortalIcon,
  Reveal,
  SectionTitle,
} from '@/components/portal/widgets';
import { cn } from '@/lib/utils';

export interface SimpleNav {
  go: (view: import('@/lib/portal-data').ViewName, params?: Record<string, string>) => void;
}

/* ================= About (tabbed: full emdad.ir "معرفی" sections) ================= */

type AboutTab = 'glance' | 'board' | 'goals' | 'charter' | 'stats' | 'org' | 'statute';

const ABOUT_TABS: { key: AboutTab; label: string; icon: React.ElementType }[] = [
  { key: 'glance', label: 'امداد در یک نگاه', icon: EyeIcon },
  { key: 'board', label: 'هیأت امنا', icon: Users },
  { key: 'goals', label: 'اهداف و رویکرد', icon: Target },
  { key: 'charter', label: 'منشور اخلاقی', icon: ShieldCheck },
  { key: 'stats', label: 'آمار و عملکرد', icon: TrendingUp },
  { key: 'org', label: 'ساختار سازمانی', icon: Landmark },
  { key: 'statute', label: 'اساسنامه و قوانین', icon: ScrollText },
];

const BOARD_MEMBERS = [
  { role: 'رئیس کمیته امداد امام خمینی (ره)', desc: 'رئیس هیأت امنا و بالاترین مقام اجرایی نهاد؛ مسئول سیاست‌گذاری کلان و نمایندگی کمیته امداد در مجامع رسمی کشور.' },
  { role: 'نماینده مقام معظم رهبری', desc: 'نماینده ولی‌فقیه در هیأت امنا با هدف حفظ رویکرد انقلابی، شرعی و مردمی بودن حمایت‌ها.' },
  { role: 'نماینده رئیس‌جمهور', desc: 'هماهنگی سیاست‌های حمایتی دولت با برنامه‌های کمیته امداد در کمیسیون‌های ابلاغی.' },
  { role: 'وزیر کشور', desc: 'هماهنگی استانی، پشتیبانی دفاتر و تعامل با فرمانداران در شناسایی و خدمت‌رسانی به مددجویان.' },
  { role: 'وزیر بهداشت، درمان و آموزش پزشکی', desc: 'همکاری در طرح‌های سلامت‌محور، بیمه درمانی مددجویان و خدمات توانبخشی.' },
  { role: 'وزیر آموزش و پرورش', desc: 'حمایت تحصیلی دانش‌آموزان مددجو، بسته‌های آموزشی و برنامه‌های اردویی.' },
  { role: 'نماینده مجلس شورای اسلامی', desc: 'پیگیری قانونی بودجه‌ها، نظارت پارلمانی بر عملکرد و حمایت از طرح‌های توانمندسازی.' },
];

function AboutGlance() {
  return (
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
  );
}

function AboutBoard() {
  return (
    <div className="space-y-4">
      <Reveal>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="mb-2 flex items-center gap-2 text-base font-black">
              <Users size={19} className="text-primary" /> ترکیب هیأت امنا
            </h3>
            <p className="text-[13px] leading-8 text-muted-foreground">
              بر اساس اساسنامه، هیأت امنای کمیته امداد امام خمینی (ره) با حضور نمایندگان قوای سه‌گانه و
              مقام معظم رهبری تشکیل می‌شود. این ترکیب، نظارت هم‌زمان مردمی، شرعی و دولتی را بر عملکرد نهاد
              تضمین می‌کند و سیاست‌های کلان حمایتی را تصویب می‌نماید.
            </p>
          </CardContent>
        </Card>
      </Reveal>
      <div className="grid gap-3 sm:grid-cols-2">
        {BOARD_MEMBERS.map((m, i) => (
          <Reveal key={m.role} delay={i * 0.05}>
            <div className="flex h-full items-start gap-3 rounded-2xl border bg-card p-4 card-hover">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BadgeCheck size={18} />
              </span>
              <div>
                <p className="text-[13px] font-black leading-6">{m.role}</p>
                <p className="mt-1 text-[11px] leading-6 text-muted-foreground">{m.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function AboutGoals() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          {
            title: 'هدف راهبردی نخست: فقرزدایی محترمانه',
            desc: 'رسیدگی به معیشت محرومان با حفظ کرامت انسانی و حرمت خانواده مددجو؛ کمک‌ها بدون تحقیر و به صورت کاملاً محترمانه و بدون رقابت با فقرا دیگر ارائه می‌شود.',
          },
          {
            title: 'هدف راهبردی دوم: توانمندسازی پایدار',
            desc: 'حرکت از کمک معیشت به سمت خوداتکایی از طریق تسهیلات اشتغال، آموزش مهارت‌های فنی و حرفه‌ای، حمایت از کارآفرینی و مشاوره؛ تا خانواده‌ها از چرخه کمک خارج شوند.',
          },
          {
            title: 'هدف راهبردی سوم: توسعه مشارکت‌های مردمی',
            desc: 'گسترش فرهنگ نیکوکاری و انفاق در جامعه، تسهیل مشارکت هوشمند خیرین از طریق سامانه‌های الکترونیکی و شفاف‌سازی کامل هزینه‌کرد کمک‌ها.',
          },
          {
            title: 'هدف راهبردی چهارم: توسعه خدمات فرهنگی',
            desc: 'ترویج سنت‌های حسنه اسلامی، ازدواج آسان جوانان، حمایت از خانواده، پیشگیری از آسیب‌های اجتماعی و توانمندسازی فرهنگی و اجتماعی مددجویان.',
          },
          {
            title: 'رویکرد نوآورانه: هوشمندسازی امداد',
            desc: 'بهره‌گیری از هوش مصنوعی و مرکز پایش فقر برای شناسایی هدفمند نیازمندان، هوشمندسازی فرایندها، حذف واسطه‌ها و پرداخت مستقیم به حساب مددجویان.',
          },
          {
            title: 'رویکرد بین‌المللی: بشردوستانه بدون مرز',
            desc: 'ارسال کمک‌های مردمی به آسیب‌دیدگان کشورهای مختلف در چارچوب اصول انسان‌دوستی و دیپلماسی مردمی، مستقل از ملاحظات سیاسی.',
          },
        ].map((g, i) => (
          <Reveal key={g.title} delay={i * 0.06}>
            <Card className="h-full card-hover gradient-border">
              <CardContent className="flex items-start gap-3 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target size={18} />
                </span>
                <div>
                  <p className="text-sm font-black leading-6">{g.title}</p>
                  <p className="mt-2 text-[12px] leading-7 text-muted-foreground">{g.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function AboutCharter() {
  const principles = [
    { title: 'حرمت و کرامت مددجو', desc: 'احترام به شخصیت انسانی خانواده‌های تحت حمایت در تمام تعاملات، بدون هيچ‌گونه رفتار تحقیرآمیز.' },
    { title: 'شفافیت کامل مالی', desc: 'گزارش شفاف دریافت و هزینه‌کرد تمام منابع، قابل رصد برای نیکوکاران و نهادهای نظارتی.' },
    { title: 'عدالت در توزیع', desc: 'توزیع خدمات صرفاً بر اساس نیازسنجی و شاخص‌های هدفمند، بدون تبعیض قومی، مذهبی و منطقه‌ای.' },
    { title: 'محرمانگی اطلاعات', desc: 'حفظ اسرار و اطلاعات شخصی و خانوادگی مددجویان در تمام سامانه‌ها و فرایندها.' },
    { title: 'پاسخگویی به مردم', desc: 'ارائه گزارش عملکرد به نیکوکاران و پاسخگویی شبانه‌روزی از طریق مرکز تماس ۱۴۹۸.' },
    { title: 'تعهد شرعی و اخلاقی', desc: 'امانت‌داری در وجوه شرعی مردم (زکات، کفاره، نذر) و صرف صددرصدی در همان نیت انتخابی.' },
    { title: 'پرهیز از اسم و رسم', desc: 'بازسازی تصویر امداد بدون تبلیغ فردی؛ تمرکز بر خدمت نه شهرت.' },
    { title: 'بهره‌گیری از توان داوطلبانه', desc: 'به‌کارگیری ظرفیت داوطلبان، خیرین و تشکل‌های مردمی در طراحی و اجرای خدمات.' },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {principles.map((p, i) => (
        <Reveal key={p.title} delay={i * 0.05}>
          <div className="flex h-full items-start gap-3 rounded-2xl border bg-card p-4 card-hover">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={17} />
            </span>
            <div>
              <p className="text-[13px] font-black">{p.title}</p>
              <p className="mt-1 text-[11px] leading-6 text-muted-foreground">{p.desc}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function AboutStats() {
  const yearly = [
    { year: '۱۴۰۰', services: '۲٬۱۰۰ هزار قلم', medjooyan: '۴.۱ میلیون', moavenat: '۳۸ هزار میلیارد تومان' },
    { year: '۱۴۰۱', services: '۲٬۴۰۰ هزار قلم', medjooyan: '۴.۳ میلیون', moavenat: '۴۱ هزار میلیارد تومان' },
    { year: '۱۴۰۲', services: '۲٬۸۰۰ هزار قلم', medjooyan: '۴.۵ میلیون', moavenat: '۴۵ هزار میلیارد تومان' },
    { year: '۱۴۰۳', services: '۳٬۲۰۰ هزار قلم', medjooyan: '۴.۷ میلیون', moavenat: '۴۸ هزار میلیارد تومان' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { v: 9200000, label: 'نیکوکار فعال' },
          { v: 4700000, label: 'مددجو تحت حمایت' },
          { v: 517000, label: 'حامی طرح اکرام' },
          { v: 1700, label: 'قلم خدمت' },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05}>
            <Card className="text-center card-hover">
              <CardContent className="p-5">
                <p className="text-2xl font-black text-primary">
                  <AnimatedCounter value={s.v} />
                </p>
                <p className="mt-1 text-xs font-bold text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="mb-4 text-sm font-black">عملکرد سالانه به تفکیک شاخص</p>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-right text-[13px]">
                <thead>
                  <tr className="border-b bg-muted/60 text-xs">
                    <th className="p-3 font-black">سال</th>
                    <th className="p-3 font-black">خدمات ارائه‌شده</th>
                    <th className="p-3 font-black">مددجویان تحت پوشش</th>
                    <th className="p-3 font-black">حجم حمایت‌ها</th>
                  </tr>
                </thead>
                <tbody>
                  {yearly.map((r) => (
                    <tr key={r.year} className="border-b last:border-0 transition-colors hover:bg-primary/5">
                      <td className="p-3 font-black text-primary">{r.year}</td>
                      <td className="p-3">{r.services}</td>
                      <td className="p-3">{r.medjooyan}</td>
                      <td className="p-3">{r.moavenat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              گزارش تفصیلی و قابل استناد در «سامانه شفافیت» پورتال در دسترس است.
            </p>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}

function AboutOrg() {
  return (
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
  );
}

function AboutStatute() {
  return (
    <div className="space-y-4">
      {[
        {
          h: 'تأسیس و ماهیت حقوقی',
          p: 'کمیته امداد امام خمینی (ره) بر اساس فرمان تاریخ ۱۴ اسفند ۱۳۵۷ بنیان‌گذار کبیر انقلاب اسلامی تأسیس شد و دارای شخصیت حقوقی مستقل است. این نهاد زیر نظر مقام معظم رهبری فعالیت می‌کند و در چارچوب اساسنامه مصوب، وظیفه رسیدگی به امور محرومان و نیازمندان را بر عهده دارد.',
        },
        {
          h: 'ارکان و ساختار',
          p: 'ارکان اصلی نهاد شامل هیأت امنا (با حضور نمایندگان قوای سه‌گانه)، رئیس کمیته امداد، معاونت‌های تخصصی و ادارات کل ۳۱ استان است. جلسات هیأت امنا حداقل هر سه ماه یک‌بار تشکیل می‌شود و سیاست‌های کلان، بودجه سالانه و گزارش عملکرد در آن تصویب یا بررسی می‌گردد.',
        },
        {
          h: 'منابع مالی',
          p: 'بودجه کمیته امداد از محل کمک‌های مردمی، وجوه شرعی (زکات، کفاره، نذر و صدقات)، اعتبارات دولت و مشارکت خیرین سازمانی تأمین می‌شود. کلیه حساب‌ها تحت نظارت رسمی، حسابرسی مستقل و سامانه شفافیت قرار دارد و گزارش تفریغ بودجه به صورت سالانه منتشر می‌شود.',
        },
        {
          h: 'قوانین و مقررات حاکم',
          p: 'فعالیت‌های کمیته امداد تابع قوانین جاری کشور، اساسنامه نهاد، منشور اخلاقی مصوب و ضوابط ابلاغی هیأت امناست. خدمات‌دهی به مددجویان بر اساس آیین‌نامه‌های مصوب و شاخص‌های هدفمند انجام می‌شود و ثبت هر درخواست با کد رهگیری قابل پیگیری است.',
        },
        {
          h: 'حمایت حقوقی رایگان',
          p: 'معاونت حقوقی و امور مجلس به مددجویان واجد شرایط خدمات مشاوره حقوقی، وکالت و پیگیری قضایی رایگان ارائه می‌کند. دفاتر حقوقی در سراسر کشور فعال بوده و متقاضیان می‌توانند از طریق مرکز تماس ۱۴۹۸ یا دفاتر امور مددجویی اقدام کنند.',
        },
      ].map((s, i) => (
        <Reveal key={s.h} delay={i * 0.05}>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Scale size={15} />
                </span>
                {s.h}
              </h3>
              <p className="text-[13px] leading-8 text-muted-foreground">{s.p}</p>
            </CardContent>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export function AboutView({ nav, initialTab }: { nav: SimpleNav; initialTab?: string }) {
  const validTabs: AboutTab[] = ['glance', 'board', 'goals', 'charter', 'stats', 'org', 'statute'];
  const init = (validTabs.includes(initialTab as AboutTab) ? initialTab : 'glance') as AboutTab;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionTitle
        eyebrow="معرفی"
        title="معرفی کمیته امداد امام خمینی (ره)"
        desc="بزرگترین نهاد حمایتی کشور با بیش از چهار دهه خدمت‌رسانی به محرومان و نیازمندان — در ۷ بخش کامل"
      />

      <Tabs defaultValue={init} className="w-full">
        <div className="mb-6 overflow-x-auto pb-1 scroll-thin">
          <TabsList className="inline-flex h-auto w-max gap-1 rounded-2xl p-1.5">
            {ABOUT_TABS.map((t) => (
              <TabsTrigger
                key={t.key}
                value={t.key}
                className="gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] data-[state=active]:shadow-md"
              >
                <t.icon size={15} />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="glance" className="mt-2"><AboutGlance /></TabsContent>
        <TabsContent value="board" className="mt-2"><AboutBoard /></TabsContent>
        <TabsContent value="goals" className="mt-2"><AboutGoals /></TabsContent>
        <TabsContent value="charter" className="mt-2"><AboutCharter /></TabsContent>
        <TabsContent value="stats" className="mt-2"><AboutStats /></TabsContent>
        <TabsContent value="org" className="mt-2"><AboutOrg /></TabsContent>
        <TabsContent value="statute" className="mt-2"><AboutStatute /></TabsContent>
      </Tabs>

      {/* Related links */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => nav.go('transparency')} className="gap-2 rounded-full">
          <Landmark size={15} /> سامانه شفافیت
        </Button>
        <Button variant="outline" onClick={() => nav.go('news')} className="gap-2 rounded-full">
          <FileText size={15} /> پایگاه اطلاع‌رسانی
        </Button>
        <Button variant="outline" onClick={() => nav.go('services')} className="gap-2 rounded-full">
          <BookOpen size={15} /> میز خدمت
        </Button>
      </div>
    </div>
  );
}

/* ================= Provinces ================= */

export function ProvincesView({ nav, initialProvince }: { nav: SimpleNav; initialProvince?: string }) {
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
              onClick={() => nav.go('news', { province: p })}
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
        {active.items.map((m) => (
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
