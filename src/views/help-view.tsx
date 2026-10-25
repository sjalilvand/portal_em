'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Heart,
  HeartHandshake,
  Landmark,
  Loader2,
  QrCode,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PROVINCES } from '@/lib/portal-data';
import { formatPersianNumber, toPersianDigits } from '@/lib/settings';
import { SectionTitle } from '@/components/portal/widgets';
import { toast } from 'sonner';

const SPONSOR_AMOUNTS = [150000, 300000, 500000, 1000000];
const DONATE_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 5000000];

export function HelpView({ initialTab }: { initialTab?: string }) {
  const [tab, setTab] = useState(initialTab === 'donate' ? 'donate' : 'sponsor');
  const [sponsorType, setSponsorType] = useState('');
  const [province, setProvince] = useState('');
  const [amount, setAmount] = useState<number>(SPONSOR_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [donateAmount, setDonateAmount] = useState<number>(DONATE_AMOUNTS[1]);
  const [donateType, setDonateType] = useState('صدقه عام');
  const [loading, setLoading] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount.replace(/\D/g, '')) || 0 : amount;

  async function pay() {
    if (!name.trim() || mobile.trim().length < 10) {
      toast.error('لطفا نام و شماره موبایل معتبر وارد کنید');
      return;
    }
    if (!finalAmount || finalAmount < 10000) {
      toast.error('مبلغ واردشده حداقل ۱۰ هزار تومان است');
      return;
    }
    setLoading(true);
    // simulate gateway
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    toast.success(
      `پرداخت ${formatPersianNumber(finalAmount)} تومان با موفقیت انجام شد. کد رهگیری: ${toPersianDigits(Math.floor(100000 + Math.random() * 899999))}`,
      { duration: 6000 }
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionTitle
        center
        eyebrow="مشارکت الکترونیکی"
        title="می‌خواهم کمک کنم"
        desc="با پرداخت امن و شفاف، حامی اکرام ایتام شوید یا کمک و صدقه خود را آنلاین اهدا کنید. رسید و کد رهگیری بلافاصله صادر می‌شود."
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

        {/* Sponsor tab */}
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
                  <Label>نوع حامی‌پذیری</Label>
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
                  <Label>استان محل حامی‌پذیری</Label>
                  <Select value={province} onValueChange={setProvince}>
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
                      onClick={() => { setAmount(a); setCustomAmount(''); }}
                      className={`rounded-xl border-2 py-2.5 text-xs font-bold transition-all ${
                        !customAmount && amount === a
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'hover:border-primary/40'
                      }`}
                    >
                      {formatPersianNumber(a)}
                    </button>
                  ))}
                </div>
                <Input
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="مبلغ دلخواه (تومان)"
                  className="rounded-xl"
                  inputMode="numeric"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>نام و نام خانوادگی حامی</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلا: محمد محمدی" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>شماره موبایل</Label>
                  <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="۰۹۱۲..." className="rounded-xl" inputMode="tel" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>پیام شما برای حامی‌پذیر (اختیاری)</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="دلنوشته شما..." className="rounded-xl min-h-20" />
              </div>

              <Button
                onClick={pay}
                disabled={loading}
                size="lg"
                className="w-full gap-2 rounded-2xl text-base"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                پرداخت ماهانه {formatPersianNumber(finalAmount)} تومان
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck size={13} className="text-primary" />
                پرداخت از طریق درگاه امن بانکی؛ رسید و گزارش عملکرد پیامک می‌شود
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donate tab */}
        <TabsContent value="donate" className="mt-6">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="hero-gradient px-6 py-5 text-primary-foreground">
              <p className="flex items-center gap-2 font-black">
                <QrCode size={18} className="text-amber-300" /> صدقه، نذر، زکات و کفاره
              </p>
              <p className="mt-1 text-xs opacity-85">پرداخت آنی و شفاف با کد رهگیری</p>
            </div>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-1.5">
                <Label>نوع کمک</Label>
                <Select value={donateType} onValueChange={setDonateType}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="صدقه عام">صدقه عام</SelectItem>
                    <SelectItem value="صدقه ازدواج">صدقه برای رفع موانع ازدواج</SelectItem>
                    <SelectItem value="صدقه درمان">صدقه برای درمان بیماران</SelectItem>
                    <SelectItem value="صدقه تحصیل">صدقه برای تحصیل دانش‌آموزان</SelectItem>
                    <SelectItem value="آزادی زندانیان">کمک به آزادی زندانیان</SelectItem>
                    <SelectItem value="زکات فطره">زکات فطره</SelectItem>
                    <SelectItem value="کفاره">کفاره و فدیه</SelectItem>
                    <SelectItem value="نذر">نذر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>مبلغ (تومان)</Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {DONATE_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setDonateAmount(a)}
                      className={`rounded-xl border-2 py-2.5 text-xs font-bold transition-all ${
                        donateAmount === a
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'hover:border-primary/40'
                      }`}
                    >
                      {formatPersianNumber(a)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>نام اهداکننده</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="نام شما" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>شماره موبایل (برای رسید)</Label>
                  <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="۰۹۱۲..." className="rounded-xl" inputMode="tel" />
                </div>
              </div>

              <Button
                onClick={pay}
                disabled={loading}
                size="lg"
                className="w-full gap-2 rounded-2xl text-base"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                پرداخت {formatPersianNumber(donateAmount)} تومان ({donateType})
              </Button>

              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="flex items-center gap-2 text-xs font-bold">
                  <Landmark size={15} className="text-primary" /> شماره حساب کمک به نیازمندان
                </p>
                <p className="mt-2 flex items-center justify-between rounded-xl bg-card px-4 py-3 text-sm font-black tracking-widest" dir="ltr">
                  IR05 0170 0000 0012 3456 7890 12
                  <button
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 grid gap-3 sm:grid-cols-3"
      >
        {[
          { icon: ShieldCheck, title: 'پرداخت امن', desc: 'درگاه بانکی با استاندارد امنیتی' },
          { icon: CheckCircle2, title: 'شفافیت کامل', desc: 'گزارش عملکرد هر ریال کمک' },
          { icon: Landmark, title: 'رسید رسمی', desc: 'کد رهگیری فوری پس از پرداخت' },
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
    </div>
  );
}
