'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Building2,
  Download,
  FileSpreadsheet,
  FileText,
  HandCoins,
  Landmark,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedCounter, PortalIcon, Reveal, SectionTitle } from '@/components/portal/widgets';
import { toPersianDigits } from '@/lib/settings';
import { cn } from '@/lib/utils';

/* ---------------- Data ---------------- */

const CHART_COLORS = ['#10b981', '#0891b2', '#8b5cf6', '#f97316', '#b45309', '#64748b'];

const BUDGET_DISTRIBUTION = [
  { name: 'حمایت و سلامت خانواده', value: 42 },
  { name: 'توانمندسازی و اشتغال', value: 21 },
  { name: 'مسکن و مهندسی', value: 14 },
  { name: 'امور فرهنگی و اجتماعی', value: 10 },
  { name: 'امور بین‌الملل', value: 8 },
  { name: 'اداری و اجرایی', value: 5 },
];

const INCOME_SOURCES = [
  { name: 'کمک‌های مردمی نیکوکاران', value: 58 },
  { name: 'وجوه شرعی (زکات، کفاره، نذر)', value: 17 },
  { name: 'اعتبارات دولتی', value: 15 },
  { name: 'مشارکت خیرین سازمانی', value: 7 },
  { name: 'سایر درآمدها', value: 3 },
];

const PERFORMANCE_TREND = [
  { year: '۱۳۹۹', medjooyan: 3.9, khanevar: 0.94 },
  { year: '۱۴۰۰', medjooyan: 4.1, khanevar: 1.0 },
  { year: '۱۴۰۱', medjooyan: 4.3, khanevar: 1.05 },
  { year: '۱۴۰۲', medjooyan: 4.5, khanevar: 1.1 },
  { year: '۱۴۰۳', medjooyan: 4.7, khanevar: 1.12 },
];

const BUDGET_TABLE = [
  { hoze: 'حمایت و سلامت خانواده', mablagh: '۱۲٬۶۰۰', sahman: '۴۲٪', growth: '+۸٪' },
  { hoze: 'توانمندسازی و اشتغال', mablagh: '۶٬۳۰۰', sahman: '۲۱٪', growth: '+۱۲٪' },
  { hoze: 'مسکن و مهندسی', mablagh: '۴٬۲۰۰', sahman: '۱۴٪', growth: '+۵٪' },
  { hoze: 'امور فرهنگی و اجتماعی', mablagh: '۳٬۰۰۰', sahman: '۱۰٪', growth: '+۶٪' },
  { hoze: 'امور بین‌الملل و امداد', mablagh: '۲٬۴۰۰', sahman: '۸٪', growth: '+۳٪' },
  { hoze: 'اداری و اجرایی', mablagh: '۱٬۵۰۰', sahman: '۵٪', growth: '-۱٪' },
];

interface ReportDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
  date: string;
  sections: { h: string; p: string }[];
  figures: { label: string; value: string }[];
}

const REPORTS: ReportDef[] = [
  {
    id: 'five-year',
    title: 'گزارش عملکرد پنج‌ساله',
    desc: 'خلاصه خدمات ارائه‌شده طی ۵ سال اخیر به تفکیک حوزه',
    icon: 'BarChart3',
    date: 'دی ۱۴۰۳',
    sections: [
      {
        h: 'چکیده گزارش',
        p: 'طی پنج سال گذشته (۱۳۹۹ تا ۱۴۰۳)، کمیته امداد امام خمینی (ره) با اتکا به مشارکت بیش از ۹ میلیون نیکوکار، مسیر حرکت از «کمک معیشت» به «توانمندسازی پایدار» را طی کرده است. در این دوره بیش از ۱٬۷۰۰ قلم خدمت در حوزه‌های معیشت، سلامت، مسکن، اشتغال، تحصیل و فرهنگ به خانواده‌های تحت حمایت ارائه شد.',
      },
      {
        h: 'دستاوردهای کلیدی',
        p: 'شناسایی هدفمند نیازمندان با مرکز پایش فقر و هوش مصنوعی، رشد ۴۰ درصدی تسهیلات اشتغال‌زایی، احداث و تعمیر بیش از ۹۰ هزار واحد مسکونی، ارائه بیش از ۳۵۰ هزار خدمت پزشکی تخصصی و حمایت از نخبگان تحت پوشش از مهم‌ترین دستاوردهای این پنج سال است.',
      },
    ],
    figures: [
      { label: 'میانگین مددجویان سالانه', value: '۴.۳ میلیون نفر' },
      { label: 'تسهیلات اشتغال', value: '۲٬۱۰۰ میلیارد تومان' },
      { label: 'واحد مسکونی', value: '۹۰ هزار واحد' },
      { label: 'خدمت پزشکی', value: '۳۵۰ هزار خدمت' },
    ],
  },
  {
    id: 'sadogh',
    title: 'گزارش طرح صدقات',
    desc: 'عملکرد صدقات الکترونیکی و محل هزینه‌کرد هر نیت',
    icon: 'HandCoins',
    date: 'آذر ۱۴۰۳',
    sections: [
      {
        h: 'عملکرد پرداخت‌ها',
        p: 'صندوق صدقه الکترونیکی کمیته امداد با بیش از ۲۴ هزار پایگاه مردمی و کدهای QR اختصاصی، امکان پرداخت آنی صدقه را فراهم کرده است. طی سال گذشته بیش از ۵۰۰ میلیارد تومان صدقه مردمی از کانال‌های الکترونیکی دریافت شد که ۱۰۰ درصد آن در همان نیت انتخابی هزینه شده است.',
      },
      {
        h: 'تفکیک نیت‌ها',
        p: 'صدقه عام ۴۵ درصد، رفع موانع ازدواج ۱۶ درصد، درمان بیماران ۱۴ درصد، تحصیل دانش‌آموزان ۱۲ درصد، آزادی زندانیان نیازمند ۸ درصد و اطعام ۵ درصد از کل مبالغ را شامل می‌شود. گزارش لحظه‌ای مصرف در سامانه مشارکت الکترونیکی قابل رصد است.',
      },
    ],
    figures: [
      { label: 'دریافت سالانه', value: '۵۰۰ میلیارد تومان' },
      { label: 'پایگاه مردمی', value: '۲۴ هزار پایگاه' },
      { label: 'هزینه در همان نیت', value: '۱۰۰ درصد' },
      { label: 'نیکوکاران فعال', value: '۹.۲ میلیون نفر' },
    ],
  },
  {
    id: 'infographic',
    title: 'اینفوگرافیک مددجویان',
    desc: 'آمار خانوارها و مددجویان تحت حمایت به تفکیک گروه‌ها',
    icon: 'Users',
    date: 'بهمن ۱۴۰۳',
    sections: [
      {
        h: 'ترکیب جمعیت تحت حمایت',
        p: 'در حال حاضر بیش از ۴.۷ میلیون مددجو در قالب ۱.۱۲ میلیون خانوار تحت پوشش کمیته امداد هستند؛ شامل کودکان ایتام و بی‌سرپرست، زنان سرپرست خانوار، سالمندان بی‌بضاعت و خانواده‌های کم‌درآمد. حدود ۵۲ درصد از مددجویان را کودکان و نوجوانان تشکیل می‌دهند.',
      },
      {
        h: 'گروه‌های هدف ویژه',
        p: '۵۱۷ هزار کودک یتیم در طرح اکرام، بیش از ۳۸۰ هزار سالمند مددجو، ۴۲۰ هزار نفر در قالب معیشت خانوارهای کم‌درآمد و ده‌ها هزار دانش‌آموز و دانشجوی نخبه از گروه‌های هدف اصلی خدمات هستند. پوشش خدمات در هر ۳۱ استان و بیش از ۴۰۰ شهرستان برقرار است.',
      },
    ],
    figures: [
      { label: 'مددجویان', value: '۴.۷ میلیون نفر' },
      { label: 'خانوار', value: '۱.۱۲ میلیون خانوار' },
      { label: 'ایتام (اکرام)', value: '۵۱۷ هزار نفر' },
      { label: 'سالمندان', value: '۳۸۰ هزار نفر' },
    ],
  },
  {
    id: 'centers',
    title: 'مراکز نیکوکاری',
    desc: 'فهرست و عملکرد مراکز نیکوکاری در سراسر کشور',
    icon: 'Building2',
    date: 'آبان ۱۴۰۳',
    sections: [
      {
        h: 'شبکه مراکز نیکوکاری',
        p: 'بیش از ۴۵۰ مرکز نیکوکاری شهرستانی و محله‌ای زیر نظر معاونت توسعه مشارکت‌های مردمی فعالیت می‌کنند. این مراکز با هدف نزدیک‌شدن امداد به محل زندگی نیازمندان، پذیرش کمک‌های نقدی و غیرنقدی، شناسایی خانواده‌های نیازمند و اجرای طرح‌های محلی را بر عهده دارند.',
      },
      {
        h: 'خدمات مراکز',
        p: 'پذیرش حامی، اطعام، جهیزیه‌سازی، بسته‌های معیشتی، کارگاه‌های توانمندسازی زنان و بازارهای کار آفرینی از خدمات ثابت مراکز است. هر مرکز با نظارت اداره کل استان عمل کرده و گزارش عملکرد فصلی آن در سامانه شفافیت منتشر می‌شود.',
      },
    ],
    figures: [
      { label: 'مراکز نیکوکاری', value: '۴۵۰ مرکز' },
      { label: 'پایگاه امداد', value: '۲۴ هزار پایگاه' },
      { label: 'بازار کار آفرینی', value: '۱۲۰ بازار' },
      { label: 'پوشش استانی', value: '۳۱ استان' },
    ],
  },
  {
    id: 'budget',
    title: 'تفریغ بودجه سالانه',
    desc: 'گزارش تفریغ بودجه و سهم هر حوزه از اعتبارات',
    icon: 'FileSpreadsheet',
    date: 'بهمن ۱۴۰۳',
    sections: [
      {
        h: 'تفریغ بودجه ۱۴۰۳',
        p: 'کل اعتبارات مصرف‌شده در سال ۱۴۰۳ معادل ۳۰ هزار میلیارد تومان بود که ۹۵ درصد آن مستقیماً به خدمات مددجویان اختصاص یافت و تنها ۵ درصد صرف هزینه‌های اداری و اجرایی شد؛ این نسبت یکی از بهترین شاخص‌های کارایی در نهادهای حمایتی کشور است.',
      },
      {
        h: 'صرفه‌جویی و بهینه‌سازی',
        p: 'هوشمندسازی فرایندها، حذف واسطه‌ها در پرداخت مستمری از طریق کارت‌های بانکی مستقیم و استفاده از پلتفرم‌های دیجیتال، طی سه سال گذشته بیش از ۹۰۰ میلیارد تومان صرفه‌جویی ایجاد کرده که مستقیماً به خدمات مددجویان افزوده شده است.',
      },
    ],
    figures: [
      { label: 'اعتبارات مصرفی', value: '۳۰ هزار میلیارد تومان' },
      { label: 'سهم خدمات مددجویی', value: '۹۵ درصد' },
      { label: 'هزینه اداری', value: '۵ درصد' },
      { label: 'صرفه‌جویی ۳ ساله', value: '۹۰۰ میلیارد تومان' },
    ],
  },
  {
    id: 'international',
    title: 'گزارش امداد بین‌الملل',
    desc: 'کمک‌های بشردوستانه به کشورهای آسیب‌دیده',
    icon: 'Landmark',
    date: 'آذر ۱۴۰۳',
    sections: [
      {
        h: 'عملکرد بشردوستانه بین‌المللی',
        p: 'اداره کل هماهنگی امور بین‌الملل کمیته امداد، کمک‌های مردم شریف ایران را به آسیب‌دیدگان در کشورهای مختلف ارسال می‌کند. محموله‌های شامل پتو، چادر، مواد غذایی، دارو و اقلام ضروری زمستانی به لبنان، فلسطین، یمن، افغانستان و سوریه ارسال شده است.',
      },
      {
        h: 'شفافیت ارسال‌ها',
        p: 'تمامی محموله‌ها با هماهنگی نهادهای رسمی و سازمان امداد و نجات ارسال و صورت‌جریان‌الصرف آن‌ها در مراکز مقصد ثبت می‌شود. گزارش تصویری و فهرست اقلام هر محموله در سامانه شفافیت قابل مشاهده است.',
      },
    ],
    figures: [
      { label: 'محموله‌های ارسالی', value: '۱۸۰ محموله' },
      { label: 'کشورهای مقصد', value: '۵ کشور' },
      { label: 'اقلام ارسالی', value: '۳۴۰ تن' },
      { label: 'مستفیدگان', value: '۲۵۰ هزار نفر' },
    ],
  },
];

/* ---------------- Report dialog ---------------- */

function ReportDialog({ report: reportDef, onClose }: { report: ReportDef | null; onClose: () => void }) {
  const report = reportDef;
  if (!report) return null;

  function download() {
    if (!report) return;
    const lines: string[] = [
      report.title,
      `کمیته امداد امام خمینی (ره) — سامانه شفافیت`,
      `تاریخ انتشار: ${report.date}`,
      '',
    ];
    report.sections.forEach((s) => {
      lines.push(s.h, '-'.repeat(40), s.p, '');
    });
    lines.push('شاخص‌های کلیدی:');
    report.figures.forEach((f) => lines.push(`  • ${f.label}: ${f.value}`));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emdad-report-${report.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        role="dialog"
        aria-label={report.title}
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border bg-background shadow-2xl scroll-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PortalIcon name={report.icon} size={20} />
            </span>
            <div>
              <h3 className="text-sm font-black">{report.title}</h3>
              <p className="text-[10px] text-muted-foreground">انتشار: {report.date}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="بستن" className="rounded-xl p-2 hover:bg-muted">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {report.sections.map((s) => (
            <section key={s.h}>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-black text-primary">
                <span className="h-4 w-1 rounded-full bg-primary" />
                {s.h}
              </h4>
              <p className="text-[13px] leading-8 text-muted-foreground">{s.p}</p>
            </section>
          ))}

          <div className="grid grid-cols-2 gap-2.5">
            {report.figures.map((f) => (
              <div key={f.label} className="rounded-2xl border bg-card p-4 text-center">
                <p className="text-lg font-black text-primary">{f.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{f.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted/60 p-4">
            <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck size={15} className="text-primary" />
              این گزارش مطابق اسناد رسمی کمیته امداد تنظیم شده است.
            </p>
            <Button size="sm" onClick={download} className="gap-2 rounded-xl">
              <Download size={14} /> دانلود گزارش
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Main view ---------------- */

export function TransparencyView() {
  const [report, setReport] = useState<ReportDef | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionTitle
        eyebrow="سامانه شفافیت"
        title="گزارش شفاف هزینه‌کرد و بودجه"
        desc="تفریغ بودجه، منابع درآمد، روند عملکرد و گزارش‌های رسمی به صورت آنلاین و قابل استناد — تعهد ما به نیکوکاران: گزارش شفاف از هر ریال کمک"
      />

      {/* Highlight cards */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: 'Wallet', label: 'اعتبارات سالانه', value: 30000, suffix: 'میلیارد تومان' },
          { icon: 'Users', label: 'مددجویان تحت حمایت', value: 4700000, suffix: 'نفر' },
          { icon: 'ShieldCheck', label: 'سهم خدمات مددجویی', value: 95, suffix: 'درصد' },
          { icon: 'HandCoins', label: 'نیکوکاران مشارکت‌کننده', value: 9200000, suffix: 'نفر' },
        ].map((c, i) => (
          <Reveal key={c.label} delay={i * 0.06}>
            <Card className="card-hover gradient-border">
              <CardContent className="flex items-center gap-3 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PortalIcon name={c.icon} size={20} />
                </span>
                <div>
                  <p className="text-lg font-black text-primary">
                    {c.value >= 10000 ? <AnimatedCounter value={c.value} /> : toPersianDigits(c.value.toLocaleString('fa-IR'))}
                    <span className="ms-1 text-[10px] font-bold text-muted-foreground">{c.suffix}</span>
                  </p>
                  <p className="text-[11px] font-bold text-muted-foreground">{c.label}</p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <Tabs defaultValue="budget" className="w-full">
        <TabsList className="mx-auto grid h-auto w-full max-w-2xl grid-cols-3 rounded-2xl p-1.5">
          <TabsTrigger value="budget" className="gap-1.5 rounded-xl py-2.5 data-[state=active]:shadow-md">
            <BarChart3 size={15} /> توزیع بودجه
          </TabsTrigger>
          <TabsTrigger value="income" className="gap-1.5 rounded-xl py-2.5 data-[state=active]:shadow-md">
            <HandCoins size={15} /> منابع درآمد
          </TabsTrigger>
          <TabsTrigger value="trend" className="gap-1.5 rounded-xl py-2.5 data-[state=active]:shadow-md">
            <FileText size={15} /> روند عملکرد
          </TabsTrigger>
        </TabsList>

        {/* Budget distribution */}
        <TabsContent value="budget" className="mt-6 space-y-6">
          <Reveal>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="mb-4 text-sm font-black">سهم هر حوزه از اعتبارات (درصد)</p>
                <div className="h-80" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BUDGET_DISTRIBUTION} margin={{ top: 8, right: 8, left: 8, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8884" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: 'currentColor' }}
                        angle={-18}
                        textAnchor="end"
                        interval={0}
                        height={70}
                      />
                      <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} unit="٪" width={40} />
                      <Tooltip
                        formatter={(v) => [`${toPersianDigits(String(v))}٪`, 'سهم']}
                        contentStyle={{ borderRadius: 14, fontSize: 12, direction: 'rtl' }}
                      />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={52}>
                        {BUDGET_DISTRIBUTION.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="mb-4 text-sm font-black">جدول تفریغ بودجه ۱۴۰۳ (میلیارد تومان)</p>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-right text-[13px]">
                    <thead>
                      <tr className="border-b bg-muted/60 text-xs">
                        <th className="p-3 font-black">حوزه خدماتی</th>
                        <th className="p-3 font-black">مبلغ اعتبار</th>
                        <th className="p-3 font-black">سهم از کل</th>
                        <th className="p-3 font-black">رشد نسبت به سال قبل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BUDGET_TABLE.map((r, i) => (
                        <motion.tr
                          key={r.hoze}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b last:border-0 transition-colors hover:bg-primary/5"
                        >
                          <td className="p-3 font-bold">{r.hoze}</td>
                          <td className="p-3 text-primary font-black">{r.mablagh}</td>
                          <td className="p-3">{r.sahman}</td>
                          <td className={cn('p-3 font-bold', r.growth.startsWith('-') ? 'text-rose-600' : 'text-emerald-600')}>
                            {r.growth}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck size={13} className="text-primary" />
                  ۹۵ درصد اعتبارات مستقیماً صرف خدمات مددجویان و تنها ۵ درصد صرف هزینه‌های اداری شده است.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </TabsContent>

        {/* Income sources */}
        <TabsContent value="income" className="mt-6">
          <Reveal>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="mb-2 text-sm font-black">ترکیب منابع تأمین اعتبار</p>
                <p className="mb-4 text-[11px] text-muted-foreground">
                  بیش از ۷۵ درصد منابع از مشارکت مستقیم مردم نیکوکار و وجوه شرعی تأمین می‌شود.
                </p>
                <div className="grid items-center gap-6 lg:grid-cols-2">
                  <div className="h-72" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={INCOME_SOURCES}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={95}
                          paddingAngle={3}
                          label={({ value }) => `${toPersianDigits(String(value))}٪`}
                          labelLine={false}
                        >
                          {INCOME_SOURCES.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v, name) => [`${toPersianDigits(String(v))}٪`, name as string]}
                          contentStyle={{ borderRadius: 14, fontSize: 12, direction: 'rtl' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="space-y-2.5">
                    {INCOME_SOURCES.map((s, i) => (
                      <li key={s.name} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                        <span className="flex items-center gap-2 text-[13px] font-bold">
                          <span className="h-3 w-3 rounded-full" style={{ background: CHART_COLORS[i] }} />
                          {s.name}
                        </span>
                        <span className="text-sm font-black text-primary">{toPersianDigits(s.value)}٪</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </TabsContent>

        {/* Performance trend */}
        <TabsContent value="trend" className="mt-6">
          <Reveal>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="mb-2 text-sm font-black">روند پنج‌ساله پوشش حمایت</p>
                <p className="mb-4 text-[11px] text-muted-foreground">
                  مددجویان (میلیون نفر) و خانوارهای تحت پوشش (میلیون خانوار)
                </p>
                <div className="h-80" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PERFORMANCE_TREND} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#8884" />
                      <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'currentColor' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} width={36} />
                      <Tooltip
                        contentStyle={{ borderRadius: 14, fontSize: 12, direction: 'rtl' }}
                        formatter={(v, name) => [
                          toPersianDigits(String(v)),
                          name === 'medjooyan' ? 'مددجویان (میلیون)' : 'خانوار (میلیون)',
                        ]}
                      />
                      <Legend
                        formatter={(v) => (v === 'medjooyan' ? 'مددجویان' : 'خانوارها')}
                        wrapperStyle={{ fontSize: 12 }}
                      />
                      <Line type="monotone" dataKey="medjooyan" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
                      <Line type="monotone" dataKey="khanevar" stroke="#0891b2" strokeWidth={3} dot={{ r: 5, fill: '#0891b2' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </TabsContent>
      </Tabs>

      {/* Official reports */}
      <div className="mt-12">
        <SectionTitle
          eyebrow="اسناد رسمی"
          title="گزارش‌های رسمی قابل دانلود"
          desc="روی هر گزارش کلیک کنید تا متن کامل آن را ببینید و نسخه آن را دریافت کنید."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPORTS.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.05}>
              <Card
                className="group h-full cursor-pointer card-hover gradient-border"
                onClick={() => setReport(r)}
              >
                <CardContent className="flex h-full items-start gap-3 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <PortalIcon name={r.icon} size={20} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-black">{r.title}</p>
                    <p className="mt-1.5 text-[11px] leading-6 text-muted-foreground">{r.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] text-muted-foreground">
                        {r.date}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        مشاهده کامل ←
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 flex items-center justify-center gap-3 rounded-3xl border bg-card p-6 text-center"
      >
        <ShieldCheck size={26} className="shrink-0 text-primary" />
        <p className="text-[13px] leading-8 text-muted-foreground">
          <b className="text-foreground">تعهد شفافیت:</b> گزارش هزینه‌کرد هر کمک، نیت‌بندی صدقات و تفریغ بودجه به
          صورت سالانه در همین سامانه منتشر می‌شود. برای استعلام دقیق‌تر با مرکز تماس ۱۴۹۸ تماس بگیرید.
        </p>
      </motion.div>

      <ReportDialog report={report} onClose={() => setReport(null)} />
    </div>
  );
}
