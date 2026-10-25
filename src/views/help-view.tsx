'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  Globe,
  Heart,
  HeartHandshake,
  Landmark,
  Loader2,
  Printer,
  QrCode,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PROVINCES } from '@/lib/portal-data';
import { formatPersianNumber, formatPersianDate, toPersianDigits } from '@/lib/settings';
import { SectionTitle } from '@/components/portal/widgets';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SPONSOR_AMOUNTS = [150000, 300000, 500000, 1000000];
const DONATE_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 5000000];

/* All participation categories — complete list matching emdad.ir services */
const DONATE_CATEGORIES = [
  { value: 'صدقه عام', desc: 'صرف عمومی در امور نیازمندان' },
  { value: 'صدقه رفع موانع ازدواج', desc: 'کمک به ازدواج جوانان کم‌برخوردار' },
  { value: 'صدقه درمان بیماران', desc: 'هزینه درمان مددجویان بیمار' },
  { value: 'صدقه تحصیل دانش‌آموزان', desc: 'حمایت تحصیلی کودکان و نوجوانان' },
  { value: 'کمک به آزادی زندانیان', desc: 'دیه و جرائم نقدی زندانیان نیازمند' },
  { value: 'اطعام نیازمندان', desc: 'پخت و توزیع غذای گرم' },
  { value: 'زکات فطره', desc: 'زکات فطره مطابق مصوب علمای شورای سیاست‌گذاری' },
  { value: 'زکات مال', desc: 'زکات اموال (نقدی، سهام، طلا و...)' },
  { value: 'کفاره و فدیه', desc: 'کفاره روزه و فدیه شرعی' },
  { value: 'نذر', desc: 'انجام نذورات مردمی' },
  { value: 'وقف و هبه', desc: 'ثبت وقف و هبه اموال برای نیازمندان' },
  { value: 'کمک به نهضت مسکن', desc: 'ساخت، تکمیل و تعمیر مسکن مددجویان' },
  { value: 'کمک‌های بشردوستانه بین‌المللی', desc: 'امداد به آسیب‌دیدگان لبنان، غزه، یمن و افغانستان' },
];

interface ReceiptData {
  trackingCode: string;
  kind: string;
  category: string;
  amount: number;
  createdAt: string;
}

export function HelpView({ initialTab }: { initialTab?: string }) {
  const [tab, setTab] = useState(initialTab === 'sponsor' ? 'sponsor' : 'donate');

  /* --- Sponsor state (separate from donate to avoid leakage) --- */
  const [sponsorType, setSponsorType] = useState('');
  const [sponsorProvince, setSponsorProvince] = useState('');
  const [sponsorAmount, setSponsorAmount] = useState<number>(SPONSOR_AMOUNTS[0]);
  const [sponsorCustom, setSponsorCustom] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorMobile, setSponsorMobile] = useState('');
  const [sponsorMessage, setSponsorMessage] = useState('');

  /* --- Donate state --- */
  const [donateType, setDonateType] = useState(DONATE_CATEGORIES[0].value);
  const [donateAmount, setDonateAmount] = useState<number>(DONATE_AMOUNTS[1]);
  const [donateCustom, setDonateCustom] = useState('');
  const [donateName, setDonateName] = useState('');
  const [donateMobile, setDonateMobile] = useState('');
  const [donateMessage, setDonateMessage] = useState('');

  /* --- Gateway simulation --- */
  const [paying, setPaying] = useState(false);
  const [gatewayStep, setGatewayStep] = useState(0); // 1=connecting 2=paying 3=confirming
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  /* --- Inquiry --- */
  const [inquiryCode, setInquiryCode] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<ReceiptData | null>(null);

  const sponsorFinal = sponsorCustom ? parseInt(sponsorCustom.replace(/\D/g, '')) || 0 : sponsorAmount;
  const donateFinal = donateCustom ? parseInt(donateCustom.replace(/\D/g, '')) || 0 : donateAmount;

  async function pay(kind: 'sponsor' | 'donate') {
    const name = kind === 'sponsor' ? sponsorName : donateName;
    const mobile = kind === 'sponsor' ? sponsorMobile : donateMobile;
    const amount = kind === 'sponsor' ? sponsorFinal : donateFinal;
    const category = kind === 'sponsor' ? `پذیرش حامی (${sponsorType || 'انتخاب نشده'})` : donateType;

    if (!sponsorType && kind === 'sponsor') {
      toast.error('نوع حامی‌پذیری را انتخاب کنید');
      return;
    }
    if (kind === 'sponsor' && !sponsorProvince) {
      toast.error('استان محل حامی‌پذیری را انتخاب کنید');
      return;
    }
    if (!name.trim() || mobile.trim().length < 10) {
      toast.error('لطفا نام و شماره موبایل معتبر وارد کنید');
      return;
    }
    if (!amount || amount < 10000) {
      toast.error('مبلغ واردشده حداقل ۱۰ هزار تومان است');
      return;
    }

    // Simulated bank gateway steps
    setPaying(true);
    setGatewayStep(1);
    await new Promise((r) => setTimeout(r, 800));
    setGatewayStep(2);
    await new Promise((r) => setTimeout(r, 900));
    setGatewayStep(3);
    await new Promise((r) => setTimeout(r, 700));

    try {
      const res = await fetch('/api/contribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          category,
          amount,
          name: name.trim(),
          mobile: mobile.trim(),
          province: kind === 'sponsor' ? sponsorProvince : undefined,
          message: (kind === 'sponsor' ? sponsorMessage : donateMessage).trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'خطا در ثبت مشارکت');
        setPaying(false);
        setGatewayStep(0);
        return;
      }
      setReceipt({
        trackingCode: data.trackingCode,
        kind,
        category,
        amount,
        createdAt: data.createdAt,
      });
    } catch {
      toast.error('ارتباط با سرور برقرار نشد');
    }
    setPaying(false);
    setGatewayStep(0);
  }

  async function inquire() {
    const code = inquiryCode.trim().toUpperCase();
    if (!code) {
      toast.error('کد رهگیری را وارد کنید');
      return;
    }
    setInquiryLoading(true);
    setInquiryResult(null);
    try {
      const res = await fetch(`/api/contribution?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'مشارکتی یافت نشد');
      } else {
        setInquiryResult(data);
      }
    } catch {
      toast.error('خطا در استعلام');
    }
    setInquiryLoading(false);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => toast.success('کد رهگیری کپی شد'));
  }

  const amountBtn = (active: boolean) =>
    cn(
      'rounded-xl border-2 py-2.5 text-xs font-bold transition-all',
      active ? 'border-primary bg-primary/10 text-primary' : 'hover:border-primary/40'
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionTitle
        center
        eyebrow="مشارکت الکترونیکی"
        title="می‌خواهم کمک کنم"
        desc="با پرداخت امن و شفاف، حامی اکرام ایتام شوید یا کمک، صدقه، نذر، زکات و وقف خود را آنلاین اهدا کنید. رسید رسمی با کد رهگیری بلافاصله صادر می‌شود."
      />

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mx-auto grid h-auto w-full max-w-md grid-cols-2 rounded-2xl p-1.5">
          <TabsTrigger value="sponsor" className="gap-2 rounded-xl py-2.5 data-[state=active]:shadow-md">
            <HeartHandshake size={16} /> پذیرش حامی
          </TabsTrigger>
          <TabsTrigger value="donate" className="gap-2 rounded-xl py-2.5 data-[state=active]:shadow-md">
            <Heart size={16} /> کمک و صدقه
          </TabsTrigger>
        </TabsList>

        {/* ============ Sponsor tab ============ */}
        <TabsContent value="sponsor" className="mt-6">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="hero-gradient px-6 py-5 text-primary-foreground">
              <p className="flex items-center gap-2 font-black">
                <Sparkles size={18} className="text-amber-300" /> طرح اکرام ایتام و محسنین
              </p>
              <p className="mt-1 text-xs opacity-85">
                مسیر زندگی یک نیازمند را تغییر دهید؛ از ماه {formatPersianNumber(150000)} تومان
              </p>
            </div>
            <CardContent className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>نوع حامی‌پذیری *</Label>
                  <Select value={sponsorType} onValueChange={setSponsorType}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="child">
                        <span className="flex items-center gap-2"><User size={14} /> حامی یک کودک (یتیم)</span>
                      </SelectItem>
                      <SelectItem value="family">
                        <span className="flex items-center gap-2"><Building2 size={14} /> حامی یک خانواده</span>
                      </SelectItem>
                      <SelectItem value="elder">
                        <span className="flex items-center gap-2"><Heart size={14} /> حامی یک سالمند</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>استان محل حامی‌پذیری *</Label>
                  <Select value={sponsorProvince} onValueChange={setSponsorProvince}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="انتخاب استان" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>مبلغ ماهانه (تومان)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {SPONSOR_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setSponsorAmount(a); setSponsorCustom(''); }}
                      className={amountBtn(!sponsorCustom && sponsorAmount === a)}
                    >
                      {formatPersianNumber(a)}
                    </button>
                  ))}
                </div>
                <Input
                  value={sponsorCustom}
                  onChange={(e) => setSponsorCustom(e.target.value)}
                  placeholder="مبلغ دلخواه ماهانه (تومان)"
                  className="rounded-xl"
                  inputMode="numeric"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>نام و نام خانوادگی حامی *</Label>
                  <Input value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} placeholder="مثلا: محمد محمدی" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>شماره موبایل *</Label>
                  <Input value={sponsorMobile} onChange={(e) => setSponsorMobile(e.target.value)} placeholder="۰۹۱۲..." className="rounded-xl" inputMode="tel" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>دلنوشته برای حامی‌پذیر (اختیاری)</Label>
                <Textarea value={sponsorMessage} onChange={(e) => setSponsorMessage(e.target.value)} placeholder="دلنوشته شما..." className="rounded-xl min-h-20" />
              </div>

              <Button
                onClick={() => pay('sponsor')}
                disabled={paying}
                size="lg"
                className="w-full gap-2 rounded-2xl text-base"
              >
                {paying ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                پرداخت ماهانه {formatPersianNumber(sponsorFinal)} تومان
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck size={13} className="text-primary" />
                پرداخت از طریق درگاه امن بانکی؛ رسید و گزارش عملکرد پیامک می‌شود
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Donate tab ============ */}
        <TabsContent value="donate" className="mt-6">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="hero-gradient px-6 py-5 text-primary-foreground">
              <p className="flex items-center gap-2 font-black">
                <QrCode size={18} className="text-amber-300" /> صدقه، نذر، زکات، کفاره و وقف
              </p>
              <p className="mt-1 text-xs opacity-85">پرداخت آنی و شفاف با رسید رسمی و کد رهگیری</p>
            </div>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-1.5">
                <Label>نوع کمک ({toPersianDigits(DONATE_CATEGORIES.length)} دسته)</Label>
                <Select value={donateType} onValueChange={setDonateType}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DONATE_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <span className="flex flex-col">
                          <span>{c.value}</span>
                          <span className="text-[10px] text-muted-foreground">{c.desc}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>مبلغ (تومان)</Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {DONATE_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setDonateAmount(a); setDonateCustom(''); }}
                      className={amountBtn(!donateCustom && donateAmount === a)}
                    >
                      {formatPersianNumber(a)}
                    </button>
                  ))}
                </div>
                <Input
                  value={donateCustom}
                  onChange={(e) => setDonateCustom(e.target.value)}
                  placeholder="مبلغ دلخواه (تومان)"
                  className="rounded-xl"
                  inputMode="numeric"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>نام اهداکننده *</Label>
                  <Input value={donateName} onChange={(e) => setDonateName(e.target.value)} placeholder="نام شما" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>شماره موبایل (برای رسید) *</Label>
                  <Input value={donateMobile} onChange={(e) => setDonateMobile(e.target.value)} placeholder="۰۹۱۲..." className="rounded-xl" inputMode="tel" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>نیت یا دلنوشته (اختیاری)</Label>
                <Textarea value={donateMessage} onChange={(e) => setDonateMessage(e.target.value)} placeholder="مثلا: به نیت سلامتی و شفای مریضان..." className="rounded-xl min-h-20" />
              </div>

              <Button
                onClick={() => pay('donate')}
                disabled={paying}
                size="lg"
                className="w-full gap-2 rounded-2xl text-base"
              >
                {paying ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                پرداخت {formatPersianNumber(donateFinal)} تومان ({donateType})
              </Button>

              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="flex items-center gap-2 text-xs font-bold">
                  <Landmark size={15} className="text-primary" /> شماره حساب کمک به نیازمندان
                </p>
                <p className="mt-2 flex items-center justify-between rounded-xl bg-card px-4 py-3 text-sm font-black tracking-widest" dir="ltr">
                  IR05 0170 0000 0012 3456 7890 12
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText('IR050170000000123456789012'); toast.success('شماره شبا کپی شد'); }}
                    className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary"
                  >
                    کپی
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============ Inquiry by tracking code ============ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <p className="mb-1 flex items-center gap-2 text-sm font-black">
              <Search size={16} className="text-primary" /> استعلام رسید مشارکت
            </p>
            <p className="mb-4 text-[11px] text-muted-foreground">
              کد رهگیری دریافتی (مانند MPK-123456) را وارد کنید تا جزئیات رسید نمایش داده شود.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={inquiryCode}
                onChange={(e) => setInquiryCode(e.target.value)}
                placeholder="MPK-123456"
                className="rounded-xl"
                dir="ltr"
              />
              <Button onClick={inquire} disabled={inquiryLoading} className="gap-2 rounded-xl">
                {inquiryLoading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                استعلام
              </Button>
            </div>

            {inquiryResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4"
              >
                <div className="grid gap-2 text-[12px] sm:grid-cols-2">
                  <p><b>کد رهگیری:</b> <span dir="ltr" className="font-black text-primary">{inquiryResult.trackingCode}</span></p>
                  <p><b>مبلغ:</b> {formatPersianNumber(inquiryResult.amount)} تومان</p>
                  <p className="sm:col-span-2"><b>نوع مشارکت:</b> {inquiryResult.category}</p>
                  <p className="sm:col-span-2"><b>تاریخ ثبت:</b> {formatPersianDate(inquiryResult.createdAt)}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 grid gap-3 sm:grid-cols-3"
      >
        {[
          { icon: ShieldCheck, title: 'پرداخت امن', desc: 'درگاه بانکی با استاندارد امنیتی' },
          { icon: Globe, title: 'شفافیت کامل', desc: 'گزارش عملکرد هر ریال کمک' },
          { icon: Receipt, title: 'رسید رسمی', desc: 'کد رهگیری فوری پس از پرداخت' },
        ].map((f) => (
          <div key={f.title} className="flex items-center gap-3 rounded-2xl border bg-card p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon size={18} />
            </span>
            <div>
              <p className="text-sm font-black">{f.title}</p>
              <p className="text-[11px] text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ============ Gateway simulation dialog ============ */}
      <Dialog open={paying} onOpenChange={() => {}}>
        <DialogContent className="max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-center">
              <CreditCard size={18} className="text-primary" />
              درگاه پرداخت امن بانکی
            </DialogTitle>
            <DialogDescription className="text-center">
              لطفا تا تکمیل فرایند پرداخت صبر کنید؛ این درگاه نمایشی است.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {[
              { step: 1, label: 'اتصال به درگاه پرداخت' },
              { step: 2, label: 'پردازش تراکنش بانکی' },
              { step: 3, label: 'تایید نهایی و صدور رسید' },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
                {gatewayStep > s.step ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : gatewayStep === s.step ? (
                  <Loader2 size={18} className="animate-spin text-primary" />
                ) : (
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-muted-foreground/30 text-[9px] text-muted-foreground">
                    {toPersianDigits(s.step)}
                  </span>
                )}
                <span className={cn('text-sm', gatewayStep >= s.step ? 'font-bold' : 'text-muted-foreground')}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ Receipt dialog ============ */}
      <Dialog open={!!receipt} onOpenChange={(v) => !v && setReceipt(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <CheckCircle2 size={22} className="text-emerald-500" />
              پرداخت با موفقیت انجام شد
            </DialogTitle>
            <DialogDescription className="text-center">
              خداوند اجرتان بدهد 🌹 رسید رسمی مشارکت شما صادر شد.
            </DialogDescription>
          </DialogHeader>
          {receipt && (
            <div className="space-y-3">
              <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-4 text-[13px]">
                <div className="mb-2 flex items-center justify-center gap-2 border-b border-dashed border-primary/30 pb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/emdad-logo.png" alt="آرم" className="h-9 w-9 rounded-lg object-contain" />
                  <span className="text-xs font-black">رسید مشارکت الکترونیکی — کمیته امداد</span>
                </div>
                <div className="space-y-1.5">
                  <p className="flex justify-between"><span className="text-muted-foreground">کد رهگیری:</span><b dir="ltr" className="text-primary">{receipt.trackingCode}</b></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">مبلغ:</span><b>{formatPersianNumber(receipt.amount)} تومان</b></p>
                  <p className="flex justify-between gap-3"><span className="shrink-0 text-muted-foreground">نوع مشارکت:</span><b className="text-left">{receipt.category}</b></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">تاریخ:</span><b>{formatPersianDate(receipt.createdAt)}</b></p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => copyCode(receipt.trackingCode)} className="gap-2 rounded-xl">
                  <Copy size={14} /> کپی کد رهگیری
                </Button>
                <Button variant="outline" onClick={() => window.print()} className="gap-2 rounded-xl">
                  <Printer size={14} /> چاپ رسید
                </Button>
              </div>
              <Button onClick={() => setReceipt(null)} className="w-full rounded-xl">
                بستن
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
