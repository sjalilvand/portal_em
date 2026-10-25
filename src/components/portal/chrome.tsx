'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Accessibility,
  ArrowUp,
  ChevronDown,
  CircleUser,
  Contrast,
  Eye,
  Globe,
  Keyboard,
  Languages,
  LogIn,
  Menu,
  Minus,
  Moon,
  Pause,
  Phone,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sun,
  Type,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useSettings, toPersianDigits } from '@/lib/settings';
import { NAV_ITEMS, CONTACT_INFO, type ViewName } from '@/lib/portal-data';
import { cn } from '@/lib/utils';

/* ---------------- Types ---------------- */

export interface ChromeNav {
  go: (view: ViewName, params?: Record<string, string>) => void;
  search: (q: string) => void;
}

/* ---------------- Logo ---------------- */

export function PortalLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl hero-gradient shadow-lg shadow-primary/30">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
          <path d="M12 21s-7.5-4.6-9.3-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.3 12c-1.8 4.4-9.3 9-9.3 9Z" fill="currentColor" stroke="none" opacity="0.9" />
          <path d="M7.5 12h2l1.2-2.2 2 4 1.3-1.8h2.5" stroke="var(--primary)" strokeWidth="1.6" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="text-[15px] font-black">کمیته امداد امام خمینی (ره)</span>
          <span className="text-[10px] text-muted-foreground">بازطراحی مدرن پورتال</span>
        </span>
      )}
    </span>
  );
}

/* ---------------- Scroll progress ---------------- */

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 right-0 left-0 z-[60] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-l from-primary to-accent transition-[width] duration-150"
        style={{ width: `${p}%` }}
        role="progressbar"
        aria-label="پیشرفت اسکرول صفحه"
      />
    </div>
  );
}

/* ---------------- Theme picker ---------------- */

const THEMES: { key: import('@/lib/settings').ThemeName; label: string; swatch: string }[] = [
  { key: 'emerald', label: 'سبز امداد', swatch: '#10b981' },
  { key: 'azure', label: 'فیروزه‌ای', swatch: '#0891b2' },
  { key: 'royal', label: 'بنفش سلطنتی', swatch: '#8b5cf6' },
  { key: 'sunset', label: 'غروب مهر', swatch: '#f97316' },
  { key: 'gold', label: 'طلایی نیکوکاری', swatch: '#b45309' },
];

export function ThemePicker() {
  const { theme, setTheme, mode, toggleMode } = useSettings();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="انتخاب تم رنگی" className="rounded-full">
          <span
            className="block h-5 w-5 rounded-full border-2 border-white/60 shadow"
            style={{ background: THEMES.find((t) => t.key === theme)?.swatch }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <p className="mb-2 text-sm font-bold">تم رنگی پورتال</p>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {THEMES.map((t) => (
            <button
              key={t.key}
              title={t.label}
              aria-label={`تم ${t.label}`}
              onClick={() => setTheme(t.key)}
              className={cn(
                'h-9 rounded-xl border-2 transition-transform hover:scale-110',
                theme === t.key ? 'border-foreground/70 scale-110' : 'border-transparent'
              )}
              style={{ background: t.swatch }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
          <span className="text-sm flex items-center gap-2">
            {mode === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            حالت {mode === 'dark' ? 'شب' : 'روز'}
          </span>
          <Switch checked={mode === 'dark'} onCheckedChange={toggleMode} aria-label="تغییر حالت شب و روز" />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- Accessibility panel ---------------- */

export function AccessibilityPanel({ nav }: { nav: ChromeNav }) {
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const {
    font,
    setFont,
    fontScale,
    setFontScale,
    a11y,
    setA11y,
    mode,
    toggleMode,
    resetAll,
  } = useSettings();

  const speakPage = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      import('sonner').then(({ toast }) => toast.error('مرورگر شما از خواندن متن پشتیبانی نمی‌کند'));
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const main = document.querySelector('main');
    const text = (main?.innerText || '').slice(0, 4500);
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fa-IR';
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const FONTS: { key: import('@/lib/settings').FontName; label: string; style: string }[] = [
    { key: 'vazirmatn', label: 'وزیرمتن', style: "'Vazirmatn'" },
    { key: 'sahel', label: 'ساحل', style: "'Sahel'" },
    { key: 'samim', label: 'صمیم', style: "'Samim'" },
    { key: 'shabnam', label: 'شبنم', style: "'Shabnam'" },
  ];
  const SCALES: { v: import('@/lib/settings').FontScale; label: string }[] = [
    { v: 0.9, label: 'کوچک' },
    { v: 1, label: 'معمولی' },
    { v: 1.15, label: 'بزرگ' },
    { v: 1.3, label: 'بزرگ‌تر' },
  ];

  const toggles: { key: keyof typeof a11y; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'highContrast', label: 'کنتراست بالا', icon: <Contrast size={17} />, desc: 'رنگ‌های پرشدت برای کم‌بینایان' },
    { key: 'grayscale', label: 'سیاه و سفید', icon: <Eye size={17} />, desc: 'حذف رنگ‌ها برای نابینایان رنگی' },
    { key: 'underlineLinks', label: 'خط زیر لینک‌ها', icon: <Keyboard size={17} />, desc: 'مشخص‌شدن پیوندها' },
    { key: 'bigCursor', label: 'نشانگر بزرگ', icon: <Accessibility size={17} />, desc: 'بزرگ‌کردن موس' },
    { key: 'spacing', label: 'فاصله متن', icon: <Type size={17} />, desc: 'خوانایی بیشتر برای دیسلکسیا' },
    { key: 'motion', label: 'انیمیشن‌ها', icon: <Play size={17} />, desc: 'خاموش‌کردن حرکات صفحه' },
  ];

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setOpen(true)}
        aria-label="پنل دسترسی‌پذیری و توانخواهان"
        className="fixed bottom-5 left-5 z-50 flex h-13 w-13 items-center justify-center rounded-2xl hero-gradient text-primary-foreground shadow-xl shadow-primary/40 hover:scale-110 active:scale-95 transition-transform"
        style={{ height: 52, width: 52 }}
      >
        <Accessibility size={26} />
        <span className="absolute inset-0 rounded-2xl pulse-ring" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 top-0 z-[80] w-[340px] max-w-[92vw] overflow-y-auto bg-background border-e shadow-2xl scroll-thin"
              role="dialog"
              aria-label="پنل دسترسی‌پذیری"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between hero-gradient px-4 py-4 text-primary-foreground">
                <div className="flex items-center gap-2 font-black">
                  <Accessibility size={20} />
                  پنل دسترسی‌پذیری
                </div>
                <button onClick={() => setOpen(false)} aria-label="بستن پنل" className="rounded-lg p-1.5 hover:bg-white/15">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 p-4">
                {/* Font selector */}
                <section>
                  <p className="mb-2 text-sm font-bold flex items-center gap-1.5">
                    <Type size={15} className="text-primary" /> انتخاب فونت
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {FONTS.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setFont(f.key)}
                        className={cn(
                          'rounded-xl border-2 px-3 py-2.5 text-sm transition-all',
                          font === f.key
                            ? 'border-primary bg-primary/10 font-bold'
                            : 'border-border hover:border-primary/40'
                        )}
                        style={{ fontFamily: `${f.style}, sans-serif` }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Font size */}
                <section>
                  <p className="mb-2 text-sm font-bold flex items-center gap-1.5">
                    <Plus size={15} className="text-primary" /> اندازه متن
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SCALES.map((s) => (
                      <button
                        key={s.v}
                        onClick={() => setFontScale(s.v)}
                        className={cn(
                          'rounded-xl border-2 px-1 py-2 text-xs transition-all',
                          fontScale === s.v
                            ? 'border-primary bg-primary/10 font-bold'
                            : 'border-border hover:border-primary/40'
                        )}
                        style={{ fontSize: `${s.v * 0.85}rem` }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </section>

                {/* TTS + mode */}
                <section className="grid grid-cols-2 gap-2">
                  <Button
                    variant={speaking ? 'destructive' : 'secondary'}
                    onClick={speakPage}
                    className="gap-2"
                  >
                    {speaking ? <Pause size={16} /> : <Play size={16} />}
                    {speaking ? 'توقف خواندن' : 'خواندن صفحه'}
                  </Button>
                  <Button variant="secondary" onClick={toggleMode} className="gap-2">
                    {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {mode === 'dark' ? 'حالت روز' : 'حالت شب'}
                  </Button>
                </section>

                {/* Toggles */}
                <section className="space-y-1.5">
                  {toggles.map((t) => (
                    <div
                      key={t.key}
                      className="flex items-center justify-between rounded-xl border bg-card px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-primary">{t.icon}</span>
                        <div>
                          <p className="text-sm font-bold">{t.label}</p>
                          <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={t.key === 'motion' ? a11y.motion : a11y[t.key]}
                        onCheckedChange={(v) => setA11y(t.key, v)}
                        aria-label={t.label}
                      />
                    </div>
                  ))}
                </section>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetAll();
                      import('sonner').then(({ toast }) => toast.success('تنظیمات به حالت پیش‌فرض بازگشت'));
                    }}
                    className="gap-2"
                  >
                    <RotateCcw size={15} /> بازنشانی
                  </Button>
                  <Button variant="secondary" onClick={() => { setOpen(false); nav.go('admin'); }} className="gap-2">
                    <LogIn size={15} /> مدیریت اخبار
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- Top bar ---------------- */

export function TopBar({ nav }: { nav: ChromeNav }) {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const update = () => {
      try {
        setDateStr(
          new Intl.DateTimeFormat('fa-IR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date())
        );
      } catch {
        setDateStr('');
      }
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hero-gradient text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-[11px] sm:text-xs">
        <div className="hidden items-center gap-2 md:flex">
          <Phone size={13} />
          <span>مرکز تماس: {CONTACT_INFO.phone}</span>
          <span className="opacity-40">|</span>
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => nav.go('contact')}
            className="rounded-lg px-2 py-1 transition-colors hover:bg-white/15 flex items-center gap-1"
          >
            <Globe size={13} /> فارسی
          </button>
          <span className="opacity-40">|</span>
          <button
            onClick={() => nav.go('help')}
            className="rounded-lg px-2 py-1 transition-colors hover:bg-white/15 flex items-center gap-1 font-bold"
          >
            <CircleUser size={13} /> پنجره ملی خدمات دولت هوشمند
          </button>
          <span className="opacity-40 hidden sm:inline">|</span>
          <button
            onClick={() => nav.go('admin')}
            className="rounded-lg px-2 py-1 transition-colors hover:bg-white/15 hidden sm:flex items-center gap-1"
          >
            <LogIn size={13} /> حساب کاربری
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Header ---------------- */

export function Header({ nav }: { nav: ChromeNav }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState('');
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hoverOpen = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDrop(key);
  };
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setOpenDrop(null), 150);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'glass shadow-md shadow-black/5 border-b' : 'bg-background/80 border-b border-transparent'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
        <button onClick={() => nav.go('home')} aria-label="صفحه اصلی" className="shrink-0">
          <PortalLogo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="منوی اصلی">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => hoverOpen(item.key)}
                onMouseLeave={hoverClose}
              >
                <button
                  className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-expanded={openDrop === item.key}
                >
                  {item.label}
                  <ChevronDown size={14} className={cn('transition-transform', openDrop === item.key && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openDrop === item.key && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full z-50 w-72 overflow-hidden rounded-2xl border bg-popover p-2 shadow-xl"
                    >
                      {item.children.map((c) => (
                        <button
                          key={c.label}
                          onClick={() => { nav.go(c.view); setOpenDrop(null); }}
                          className="w-full rounded-xl px-3 py-2.5 text-right transition-colors hover:bg-primary/10 group"
                        >
                          <span className="block text-sm font-bold group-hover:text-primary">{c.label}</span>
                          {c.desc && <span className="block text-[11px] text-muted-foreground">{c.desc}</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                key={item.key}
                onClick={() => nav.go(item.view!)}
                className="rounded-xl px-3 py-2 text-sm font-bold transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          {/* Search */}
          <form
            onSubmit={(e) => { e.preventDefault(); nav.search(q); }}
            className="relative hidden md:block"
            role="search"
          >
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو در پورتال..."
              className="w-40 rounded-full bg-muted/60 ps-9 focus-visible:w-56 transition-all"
              aria-label="جستجو"
            />
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </form>

          <ThemePicker />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label="منو">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto scroll-thin">
              <SheetHeader>
                <SheetTitle className="text-right">
                  <PortalLogo />
                </SheetTitle>
              </SheetHeader>
              <form
                onSubmit={(e) => { e.preventDefault(); nav.search(q); setMobileOpen(false); }}
                className="relative px-4"
              >
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو..." className="rounded-full bg-muted/60 ps-9" />
                <Search size={15} className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </form>
              <nav className="flex flex-col gap-1 p-4 pt-3" aria-label="منوی موبایل">
                {NAV_ITEMS.map((item) =>
                  item.children ? (
                    <div key={item.key} className="rounded-xl bg-muted/50 p-2">
                      <p className="px-2 pb-1 text-xs font-bold text-primary">{item.label}</p>
                      {item.children.map((c) => (
                        <button
                          key={c.label}
                          onClick={() => { nav.go(c.view); setMobileOpen(false); }}
                          className="block w-full rounded-lg px-2 py-2 text-right text-sm font-bold hover:bg-primary/10"
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      key={item.key}
                      onClick={() => { nav.go(item.view!); setMobileOpen(false); }}
                      className="rounded-xl px-3 py-2.5 text-right text-sm font-bold hover:bg-primary/10"
                    >
                      {item.label}
                    </button>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Back to top ---------------- */

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="بازگشت به بالا"
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border bg-card text-primary shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Footer ---------------- */

export function Footer({ nav }: { nav: ChromeNav }) {
  const { a11y } = useSettings();
  return (
    <footer className="mt-auto hero-gradient text-primary-foreground" dir="rtl">
      <div className="dots-pattern">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* About */}
            <div>
              <PortalLogo />
              <p className="mt-4 text-sm leading-7 opacity-90">
                کمیته امداد امام (ره) از جمله اولین نهادهایی است که پس از پیروزی انقلاب اسلامی در ۱۴ اسفند ۱۳۵۷ با فرمان حضرت امام خمینی (ره) با هدف ساماندهی وضعیت معیشت محرومان و نیازمندان کشور تاسیس شد.
              </p>
              <div className="mt-4 flex gap-2">
                {['اینستاگرام', 'تلگرام', 'ایتا', 'آپارات'].map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="mb-4 font-black">دسترسی سریع</h3>
              <ul className="space-y-2 text-sm opacity-90">
                {[
                  { label: 'میز خدمات الکترونیک', view: 'services' as ViewName },
                  { label: 'مشارکت الکترونیکی', view: 'help' as ViewName },
                  { label: 'پایگاه اطلاع‌رسانی', view: 'news' as ViewName },
                  { label: 'سامانه شفافیت', view: 'transparency' as ViewName },
                  { label: 'سوالات متداول', view: 'faq' as ViewName },
                  { label: 'ارتباط با مدیران', view: 'contact' as ViewName },
                ].map((l) => (
                  <li key={l.label}>
                    <button onClick={() => nav.go(l.view)} className="hover:underline underline-offset-4">
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-4 font-black">خدمات امداد</h3>
              <ul className="space-y-2 text-sm opacity-90">
                {['پذیرش حامی اکرام', 'کمک معیشت', 'جهیزیه و ازدواج', 'وام قرض‌الحسنه', 'نهضت تهیه مسکن', 'تسهیلات اشتغال'].map((l) => (
                  <li key={l}>
                    <button onClick={() => nav.go('services')} className="hover:underline underline-offset-4">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 font-black">ارتباط با ما</h3>
              <address className="space-y-3 text-sm not-italic opacity-90 leading-7">
                <p>{CONTACT_INFO.address}</p>
                <p>کد پستی: {CONTACT_INFO.postalCode}</p>
                <p className="flex items-center gap-2">
                  <Phone size={15} /> مرکز تماس: <b>{CONTACT_INFO.phone}</b>
                </p>
              </address>
              <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-3 text-xs leading-6">
                این یک نسخه بازطراحی‌شده نمایشی از پورتال است؛ کلیه حقوق برند متعلق به «کمیته امداد امام خمینی (ره)» است.
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/20 pt-5 text-xs opacity-80 sm:flex-row">
            <p>کلیه حقوق این پایگاه به «کمیته امداد امام خمینی (ره)» تعلق دارد © {toPersianDigits(1404)}</p>
            <p className="flex items-center gap-1.5">
              <Languages size={13} /> طراحی مجدد با فناوری Next.js + دسترسی‌پذیری کامل {a11y.motion ? '' : ''}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
