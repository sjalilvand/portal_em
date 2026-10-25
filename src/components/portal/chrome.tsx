'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Accessibility,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  CircleUser,
  Contrast,
  Eye,
  ExternalLink,
  Globe2,
  Keyboard,
  Landmark,
  Languages,
  LogIn,
  Menu,
  Monitor,
  Moon,
  Pause,
  Phone,
  Play,
  Plus,
  RotateCcw,
  ScrollText,
  Search,
  ShieldCheck,
  Sun,
  Type,
  UserCheck,
  Users,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useSettings, toPersianDigits } from '@/lib/settings';
import { useLang, LANGS, localizedNumber, type Lang } from '@/lib/i18n';
import { NAV_ITEMS, CONTACT_INFO, type ViewName } from '@/lib/portal-data';
import { cn } from '@/lib/utils';

/* ---------------- Types ---------------- */

export interface ChromeNav {
  go: (view: ViewName, params?: Record<string, string>) => void;
  search: (q: string) => void;
}

/* ---------------- Logo (official-style Emdad emblem) ---------------- */

export function PortalLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-lg shadow-primary/30 ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/emdad-logo.png"
          alt="آرم کمیته امداد امام خمینی (ره)"
          className="h-9 w-9 rounded-xl object-contain"
          width={36}
          height={36}
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="text-[15px] font-black">کمیته امداد امام خمینی (ره)</span>
          <span className="text-[10px] text-muted-foreground">پورتال رسمی امداد</span>
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

const THEMES: { key: import('@/lib/settings').ThemeName; labelKey: string; label: string; swatch: string }[] = [
  { key: 'emerald', labelKey: 'theme.emerald', label: 'سبز امداد', swatch: '#10b981' },
  { key: 'azure', labelKey: 'theme.azure', label: 'فیروزه‌ای', swatch: '#0891b2' },
  { key: 'royal', labelKey: 'theme.royal', label: 'بنفش سلطنتی', swatch: '#8b5cf6' },
  { key: 'sunset', labelKey: 'theme.sunset', label: 'غروب مهر', swatch: '#f97316' },
  { key: 'gold', labelKey: 'theme.gold', label: 'طلایی نیکوکاری', swatch: '#b45309' },
];

export function ThemePicker() {
  const { theme, setTheme, mode, toggleMode } = useSettings();
  const { t } = useLang();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('theme.title', 'انتخاب تم رنگی')} className="rounded-full">
          <span
            className="block h-5 w-5 rounded-full border-2 border-white/60 shadow"
            style={{ background: THEMES.find((x) => x.key === theme)?.swatch }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <p className="mb-2 text-sm font-bold">{t('theme.title', 'تم رنگی پورتال')}</p>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {THEMES.map((x) => (
            <button
              key={x.key}
              title={t(x.labelKey, x.label)}
              aria-label={`${t('theme.title', 'تم')} ${t(x.labelKey, x.label)}`}
              onClick={() => setTheme(x.key)}
              className={cn(
                'h-9 rounded-xl border-2 transition-transform hover:scale-110',
                theme === x.key ? 'border-foreground/70 scale-110' : 'border-transparent'
              )}
              style={{ background: x.swatch }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
          <span className="text-sm flex items-center gap-2">
            {mode === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            {mode === 'dark' ? t('theme.dark', 'حالت شب') : t('theme.light', 'حالت روز')}
          </span>
          <Switch checked={mode === 'dark'} onCheckedChange={toggleMode} aria-label={t('theme.dark', 'تغییر حالت شب و روز')} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- Language switcher ---------------- */

function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.key === lang)!;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="rounded-lg px-2 py-1 transition-colors hover:bg-white/15 flex items-center gap-1"
          aria-label={t('topbar.language', 'انتخاب زبان')}
        >
          <Languages size={13} /> {current.label} <ChevronDown size={11} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-2" align="end">
        <p className="mb-1.5 px-2 text-[11px] font-bold text-muted-foreground">{t('topbar.language', 'زبان / Language')}</p>
        {LANGS.map((l) => (
          <button
            key={l.key}
            onClick={() => { setLang(l.key); setOpen(false); }}
            className={cn(
              'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-primary/10',
              lang === l.key && 'bg-primary/10 font-bold text-primary'
            )}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{l.flag}</span> {l.label}
            </span>
            {lang === l.key && <Check size={14} />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- Accessibility panel (fixed & complete) ---------------- */

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
  const { t } = useLang();

  // Stop any ongoing speech when panel unmounts or closes
  useEffect(() => {
    if (!open && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [open]);
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakPage = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      import('sonner').then(({ toast }) => toast.error(t('a11y.ttsUnsupported', 'مرورگر شما از خواندن متن پشتیبانی نمی‌کند')));
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    try {
      const main = document.querySelector('main');
      const text = (main?.innerText || '').slice(0, 6000);
      if (!text.trim()) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'fa-IR';
      utter.rate = 0.95;
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => {
        setSpeaking(false);
        import('sonner').then(({ toast }) => toast.error(t('a11y.ttsError', 'خواندن صفحه ممکن نشد')));
      };
      setSpeaking(true);
      window.speechSynthesis.speak(utter);
    } catch {
      setSpeaking(false);
      import('sonner').then(({ toast }) => toast.error(t('a11y.ttsError', 'خواندن صفحه ممکن نشد')));
    }
  };

  const FONTS: { key: import('@/lib/settings').FontName; label: string; style: string }[] = [
    { key: 'vazirmatn', label: 'وزیرمتن', style: "'Vazirmatn'" },
    { key: 'sahel', label: 'ساحل', style: "'Sahel'" },
    { key: 'samim', label: 'صمیم', style: "'Samim'" },
    { key: 'shabnam', label: 'شبنم', style: "'Shabnam'" },
  ];
  const SCALES: { v: import('@/lib/settings').FontScale; labelKey: string; label: string }[] = [
    { v: 0.9, labelKey: 'a11y.size.small', label: 'کوچک' },
    { v: 1, labelKey: 'a11y.size.normal', label: 'معمولی' },
    { v: 1.15, labelKey: 'a11y.size.large', label: 'بزرگ' },
    { v: 1.3, labelKey: 'a11y.size.xl', label: 'بزرگ‌تر' },
    { v: 1.45, labelKey: 'a11y.size.xxl', label: 'خیلی بزرگ' },
  ];

  const toggles: { key: keyof typeof a11y; labelKey: string; label: string; icon: React.ReactNode; descKey: string; desc: string }[] = [
    { key: 'highContrast', labelKey: 'a11y.highContrast', label: 'کنتراست بالا', icon: <Contrast size={17} />, descKey: 'a11y.highContrast.desc', desc: 'رنگ‌های پرشدت برای کم‌بینایان' },
    { key: 'grayscale', labelKey: 'a11y.grayscale', label: 'سیاه و سفید', icon: <Eye size={17} />, descKey: 'a11y.grayscale.desc', desc: 'حذف رنگ‌ها برای نابینایان رنگی' },
    { key: 'underlineLinks', labelKey: 'a11y.underline', label: 'خط زیر لینک‌ها', icon: <Keyboard size={17} />, descKey: 'a11y.underline.desc', desc: 'مشخص‌شدن پیوندها' },
    { key: 'bigCursor', labelKey: 'a11y.bigCursor', label: 'نشانگر بزرگ', icon: <Accessibility size={17} />, descKey: 'a11y.bigCursor.desc', desc: 'بزرگ‌کردن موس' },
    { key: 'spacing', labelKey: 'a11y.spacing', label: 'فاصله متن', icon: <Type size={17} />, descKey: 'a11y.spacing.desc', desc: 'خوانایی بیشتر برای دیسلکسیا' },
    { key: 'motion', labelKey: 'a11y.motion', label: 'انیمیشن‌ها', icon: <Play size={17} />, descKey: 'a11y.motion.desc', desc: 'روشن یا خاموش‌کردن حرکات صفحه' },
  ];

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setOpen(true)}
        aria-label={t('a11y.open', 'پنل دسترسی‌پذیری و توانخواهان')}
        className="fixed bottom-5 left-5 z-50 flex items-center justify-center rounded-2xl hero-gradient text-primary-foreground shadow-xl shadow-primary/40 hover:scale-110 active:scale-95 transition-transform"
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
              aria-label={t('a11y.title', 'پنل دسترسی‌پذیری')}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between hero-gradient px-4 py-4 text-primary-foreground">
                <div className="flex items-center gap-2 font-black">
                  <Accessibility size={20} />
                  {t('a11y.title', 'پنل دسترسی‌پذیری')}
                </div>
                <button onClick={() => setOpen(false)} aria-label={t('common.close', 'بستن پنل')} className="rounded-lg p-1.5 hover:bg-white/15">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 p-4">
                {/* Font selector */}
                <section>
                  <p className="mb-2 text-sm font-bold flex items-center gap-1.5">
                    <Type size={15} className="text-primary" /> {t('a11y.font', 'انتخاب فونت')}
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
                    <Plus size={15} className="text-primary" /> {t('a11y.size', 'اندازه متن')}
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {SCALES.map((s) => (
                      <button
                        key={s.v}
                        onClick={() => setFontScale(s.v)}
                        className={cn(
                          'rounded-xl border-2 px-1 py-2 text-[11px] transition-all',
                          fontScale === s.v
                            ? 'border-primary bg-primary/10 font-bold'
                            : 'border-border hover:border-primary/40'
                        )}
                        style={{ fontSize: `${s.v * 0.78}rem` }}
                      >
                        {t(s.labelKey, s.label)}
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
                    {speaking ? t('a11y.stopRead', 'توقف خواندن') : t('a11y.read', 'خواندن صفحه')}
                  </Button>
                  <Button variant="secondary" onClick={toggleMode} className="gap-2">
                    {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {mode === 'dark' ? t('a11y.dayMode', 'حالت روز') : t('a11y.nightMode', 'حالت شب')}
                  </Button>
                </section>

                {/* Toggles */}
                <section className="space-y-1.5">
                  {toggles.map((x) => (
                    <div
                      key={x.key}
                      className="flex items-center justify-between rounded-xl border bg-card px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-primary">{x.icon}</span>
                        <div>
                          <p className="text-sm font-bold">{t(x.labelKey, x.label)}</p>
                          <p className="text-[11px] text-muted-foreground">{t(x.descKey, x.desc)}</p>
                        </div>
                      </div>
                      <Switch
                        checked={a11y[x.key]}
                        onCheckedChange={(v) => setA11y(x.key, v)}
                        aria-label={t(x.labelKey, x.label)}
                      />
                    </div>
                  ))}
                </section>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetAll();
                      import('sonner').then(({ toast }) => toast.success(t('a11y.resetDone', 'تنظیمات به حالت پیش‌فرض بازگشت')));
                    }}
                    className="gap-2"
                  >
                    <RotateCcw size={15} /> {t('a11y.reset', 'بازنشانی')}
                  </Button>
                  <Button variant="secondary" onClick={() => { setOpen(false); nav.go('admin'); }} className="gap-2">
                    <LogIn size={15} /> {t('a11y.admin', 'مدیریت اخبار')}
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
  const { lang, t } = useLang();

  useEffect(() => {
    const update = () => {
      try {
        const locale = lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar' : 'en-GB';
        setDateStr(
          new Intl.DateTimeFormat(locale, {
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
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [lang]);

  return (
    <div className="hero-gradient text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-[11px] sm:text-xs">
        <div className="hidden items-center gap-2 md:flex">
          <Phone size={13} />
          <span>{t('topbar.callcenter', 'مرکز تماس: ۱۴۹۸')}</span>
          <span className="opacity-40">|</span>
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <span className="opacity-40">|</span>
          <button
            onClick={() => nav.go('help')}
            className="rounded-lg px-2 py-1 transition-colors hover:bg-white/15 flex items-center gap-1 font-bold"
          >
            <CircleUser size={13} /> {t('topbar.nationalWindow', 'پنجره ملی خدمات دولت هوشمند')}
          </button>
          <span className="opacity-40 hidden sm:inline">|</span>
          <button
            onClick={() => nav.go('admin')}
            className="rounded-lg px-2 py-1 transition-colors hover:bg-white/15 hidden sm:flex items-center gap-1"
          >
            <LogIn size={13} /> {t('topbar.account', 'حساب کاربری')}
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
  const { t } = useLang();

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
        <button onClick={() => nav.go('home')} aria-label={t('nav.home', 'صفحه اصلی')} className="shrink-0">
          <PortalLogo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t('nav.home', 'منوی اصلی')}>
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
                  {t(`nav.${item.key}`, item.label)}
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
                          onClick={() => { nav.go(c.view, c.params); setOpenDrop(null); }}
                          className="w-full rounded-xl px-3 py-2.5 text-right transition-colors hover:bg-primary/10 group"
                        >
                          <span className="block text-sm font-bold group-hover:text-primary">
                            {t(c.labelKey || '', c.label)}
                          </span>
                          {c.desc && <span className="block text-[11px] text-muted-foreground">{t(c.descKey || '', c.desc)}</span>}
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
                {t(`nav.${item.key}`, item.label)}
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
              placeholder={t('nav.search', 'جستجو در پورتال...')}
              className="w-40 rounded-full bg-muted/60 ps-9 focus-visible:w-56 transition-all"
              aria-label={t('nav.search', 'جستجو')}
            />
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </form>

          <ThemePicker />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label={t('nav.home', 'منو')}>
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
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('nav.search', 'جستجو...')} className="rounded-full bg-muted/60 ps-9" />
                <Search size={15} className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </form>
              <nav className="flex flex-col gap-1 p-4 pt-3" aria-label="منوی موبایل">
                {NAV_ITEMS.map((item) =>
                  item.children ? (
                    <div key={item.key} className="rounded-xl bg-muted/50 p-2">
                      <p className="px-2 pb-1 text-xs font-bold text-primary">{t(`nav.${item.key}`, item.label)}</p>
                      {item.children.map((c) => (
                        <button
                          key={c.label}
                          onClick={() => { nav.go(c.view, c.params); setMobileOpen(false); }}
                          className="block w-full rounded-lg px-2 py-2 text-right text-sm font-bold hover:bg-primary/10"
                        >
                          {t(c.labelKey || '', c.label)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      key={item.key}
                      onClick={() => { nav.go(item.view!); setMobileOpen(false); }}
                      className="rounded-xl px-3 py-2.5 text-right text-sm font-bold hover:bg-primary/10"
                    >
                      {t(`nav.${item.key}`, item.label)}
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
  const { t } = useLang();
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
          aria-label={t('a11y.reset', 'بازگشت به بالا')}
          className="fixed bottom-[4.75rem] right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border bg-card text-primary shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Visitor stats ---------------- */

interface VisitorStatsData {
  totalViews: number;
  totalVisitors: number;
  todayViews: number;
  todayVisitors: number;
  online: number;
  topBrowser: string;
}

function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'Chrome';
  const ua = navigator.userAgent;
  if (/edg\//i.test(ua)) return 'Edge';
  if (/firefox\//i.test(ua)) return 'Firefox';
  if (/opr\//i.test(ua)) return 'Opera';
  if (/chrome\//i.test(ua)) return 'Chrome';
  if (/safari\//i.test(ua)) return 'Safari';
  return 'Other';
}

/** Records the visit + heartbeat and returns live stats */
export function useVisitorStats(): (VisitorStatsData & { browser: string }) | null {
  const [stats, setStats] = useState<VisitorStatsData | null>(null);
  const [browserName, setBrowserName] = useState('');

  useEffect(() => {
    // Browser detection must be client-only to avoid hydration mismatch
    setBrowserName(detectBrowser());
    let sid = '';
    try {
      sid = localStorage.getItem('emdad-sid') || '';
      if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('emdad-sid', sid);
      }
    } catch {
      sid = 'anon-' + Math.random().toString(36).slice(2);
    }
    const browser = detectBrowser();
    const beat = () => {
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, browser }),
      }).catch(() => {});
    };
    beat();
    const hb = setInterval(beat, 120000);

    const load = () =>
      fetch('/api/stats')
        .then((r) => r.json())
        .then((d) => setStats(d))
        .catch(() => {});
    load();
    const refresh = setInterval(load, 60000);

    return () => {
      clearInterval(hb);
      clearInterval(refresh);
    };
  }, []);

  if (!stats) return null;
  return { ...stats, browser: browserName };
}

/* ---------------- Rules & regulations dialog ---------------- */

function RulesDialog() {
  const { t } = useLang();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:underline underline-offset-4 text-start">
          {t('footer.rules', 'قوانین و مقررات')}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scroll-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <ScrollText size={18} className="text-primary" />
            {t('footer.rules', 'قوانین و مقررات')}
          </DialogTitle>
          <DialogDescription className="text-right">
            اساسنامه، منشور اخلاقی و مقررات استفاده از پورتال کمیته امداد امام خمینی (ره)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-[13px] leading-8 text-muted-foreground">
          <section>
            <h4 className="font-black text-foreground">۱. اساسنامه</h4>
            <p>
              کمیته امداد امام خمینی (ره) بر اساس فرمان تاریخ ۱۴ اسفند ۱۳۵۷ امام خمینی (ره) تأسیس شد و
              فعالیت‌های آن در چارچوب اساسنامه مصوب شورای انقلاب و قوانین جاری کشور انجام می‌شود. این نهاد
              دارای شخصیت حقوقی مستقل است و بودجه آن از محل کمک‌های مردمی، وجوه شرعی و اعتبارات دولت تأمین می‌شود.
            </p>
          </section>
          <section>
            <h4 className="font-black text-foreground">۲. منشور اخلاقی</h4>
            <p>
              حرمت‌گذاری به مددجویان، حفظ کرامت انسانی، شفافیت در دریافت و هزینه‌کرد منابع، عدالت در توزیع
              خدمات، محرمانگی اطلاعات مددجویان و پاسخگویی به نیکوکاران از اصول بنیادین منشور اخلاقی کمیته
              امداد است و همه کارکنان و داوطلبان متعهد به رعایت آن هستند.
            </p>
          </section>
          <section>
            <h4 className="font-black text-foreground">۳. مقررات استفاده از پورتال</h4>
            <p>
              استفاده از خدمات الکترونیک این پورتال به منزله پذیرش مقررات است. مسئولیت صحت اطلاعات واردشده
              بر عهده کاربر است. ثبت درخواست‌های خلاف واقع موجب لغو درخواست می‌شود. اطلاعات شخصی کاربران
              صرفاً برای ارائه خدمت استفاده و مطابق قوانین حریم خصوصی محافظت می‌شود.
            </p>
          </section>
          <section>
            <h4 className="font-black text-foreground">۴. حمایت حقوقی</h4>
            <p>
              معاونت حقوقی و امور مجلس کمیته امداد به صورت رایگان خدمات مشاوره حقوقی، وکالت و حمایت قضایی
              از مددجویان واجد شرایط ارائه می‌کند. برای بهره‌مندی، از طریق مرکز تماس ۱۴۹۸ یا دفاتر
              امور مددجویی اقدام کنید.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Footer ---------------- */

const QUICK_LINKS: { label: string; view: ViewName }[] = [
  { label: 'میز خدمات الکترونیک', view: 'services' },
  { label: 'مشارکت الکترونیکی', view: 'help' },
  { label: 'پایگاه اطلاع‌رسانی', view: 'news' },
  { label: 'سامانه شفافیت', view: 'transparency' },
  { label: 'سوالات متداول', view: 'faq' },
  { label: 'ارتباط با مدیران', view: 'contact' },
];

const FOOTER_SERVICES = ['پذیرش حامی اکرام', 'کمک معیشت', 'جهیزیه و ازدواج', 'وام قرض‌الحسنه', 'نهضت تهیه مسکن', 'تسهیلات اشتغال'];

const USEFUL_LINKS = [
  { label: 'پنجره ملی خدمات دولت هوشمند', href: 'https://www.gov.ir' },
  { label: 'صندوق قرض‌الحسنه امداد ولایت', href: 'https://emdadvl.ir' },
  { label: 'صندوق صدقه الکترونیکی', href: 'https://sadogh.emdad.ir' },
  { label: 'سامانه ارتباط مردمی (سامد)', href: 'https://samad.emdad.ir' },
];

const SOCIALS = [
  { label: 'اینستاگرام', href: 'https://www.instagram.com/komite.emdad' },
  { label: 'تلگرام', href: 'https://t.me/komiteyeemdad' },
  { label: 'ایتا', href: 'https://eitaa.com/komiteyeemdad' },
  { label: 'آپارات', href: 'https://www.aparat.com/emdadnews' },
];

export function Footer({ nav }: { nav: ChromeNav }) {
  const { a11y } = useSettings();
  const { lang, t } = useLang();
  const stats = useVisitorStats();

  const num = (n: number) => localizedNumber(n, lang);

  return (
    <footer className="mt-auto hero-gradient text-primary-foreground" dir="rtl">
      <div className="dots-pattern">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* About */}
            <div>
              <PortalLogo />
              <p className="mt-4 text-sm leading-7 opacity-90">
                {t(
                  'footer.about',
                  'کمیته امداد امام (ره) از جمله اولین نهادهایی است که پس از پیروزی انقلاب اسلامی در ۱۴ اسفند ۱۳۵۷ با فرمان حضرت امام خمینی (ره) با هدف ساماندهی وضعیت معیشت محرومان و نیازمندان کشور تاسیس شد.'
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] hover:bg-white/20 transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="mb-4 font-black">{t('footer.quick', 'دسترسی سریع')}</h3>
              <ul className="space-y-2 text-sm opacity-90">
                {QUICK_LINKS.map((l) => (
                  <li key={l.label}>
                    <button onClick={() => nav.go(l.view)} className="hover:underline underline-offset-4">
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful links + services */}
            <div>
              <h3 className="mb-4 font-black">{t('footer.links', 'پیوندها')}</h3>
              <ul className="space-y-2 text-sm opacity-90">
                {USEFUL_LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline underline-offset-4"
                    >
                      {l.label} <ExternalLink size={11} className="opacity-60" />
                    </a>
                  </li>
                ))}
                <li>
                  <RulesDialog />
                </li>
                <li>
                  <button onClick={() => nav.go('contact')} className="hover:underline underline-offset-4">
                    {t('footer.mailbox', 'صندوق پست مدیران')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 font-black">{t('footer.contact', 'ارتباط با ما')}</h3>
              <address className="space-y-3 text-sm not-italic opacity-90 leading-7">
                <p>{CONTACT_INFO.address}</p>
                <p>{t('footer.postal', 'کد پستی')}: {CONTACT_INFO.postalCode}</p>
                <p className="flex items-center gap-2">
                  <Phone size={15} /> {t('footer.callcenter', 'مرکز تماس')}: <b>{CONTACT_INFO.phone}</b>
                </p>
              </address>
              <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-3 text-xs leading-6">
                {t(
                  'footer.disclaimer',
                  'این یک نسخه بازطراحی‌شده نمایشی از پورتال است؛ کلیه حقوق برند متعلق به «کمیته امداد امام خمینی (ره)» است.'
                )}
              </div>
            </div>
          </div>

          {/* Visitor statistics panel */}
          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <h3 className="flex items-center gap-2 font-black text-sm">
                <Monitor size={16} /> {t('stats.title', 'آمار بازدیدکنندگان')}
              </h3>
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                </span>
                {num(stats?.online ?? 0)} {t('stats.online', 'کاربر آنلاین')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <Monitor size={16} className="mx-auto mb-1.5 opacity-80" />
                <p className="text-[10px] opacity-75">{t('stats.browser', 'مرورگر شما')}</p>
                <p className="text-sm font-black">{stats?.browser || '—'}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <Globe2 size={16} className="mx-auto mb-1.5 opacity-80" />
                <p className="text-[10px] opacity-75">{t('stats.country', 'کشور')}</p>
                <p className="text-sm font-black">{t('stats.iran', 'ایران')}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <Eye size={16} className="mx-auto mb-1.5 opacity-80" />
                <p className="text-[10px] opacity-75">{t('stats.totalViews', 'بازدید کل')}</p>
                <p className="text-sm font-black">{num(stats?.totalViews ?? 0)}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <UserCheck size={16} className="mx-auto mb-1.5 opacity-80" />
                <p className="text-[10px] opacity-75">{t('stats.totalVisitors', 'بازدیدکننده کل')}</p>
                <p className="text-sm font-black">{num(stats?.totalVisitors ?? 0)}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <CalendarDays size={16} className="mx-auto mb-1.5 opacity-80" />
                <p className="text-[10px] opacity-75">{t('stats.todayViews', 'بازدید امروز')}</p>
                <p className="text-sm font-black">{num(stats?.todayViews ?? 0)}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <Users size={16} className="mx-auto mb-1.5 opacity-80" />
                <p className="text-[10px] opacity-75">{t('stats.todayVisitors', 'بازدیدکننده امروز')}</p>
                <p className="text-sm font-black">{num(stats?.todayVisitors ?? 0)}</p>
              </div>
            </div>

            {/* Trust badge row */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-300/70 bg-emerald-500/20" title={t('stats.enamad', 'نماد اعتماد الکترونیکی')}>
                  <ShieldCheck size={24} className="text-emerald-300" />
                </span>
                <div className="text-[11px] leading-5 opacity-90">
                  <p className="font-black">eNAMAD</p>
                  <p>{t('stats.enamad', 'نماد اعتماد الکترونیکی')}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/40 bg-white/10" title="ساماندهی رسانه‌های دیجیتال">
                  <Landmark size={22} className="opacity-90" />
                </span>
              </div>
              <button
                onClick={() => nav.go('transparency')}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-amber-500/30 transition-transform hover:scale-105"
              >
                {t('more.transparency.desc', 'گزارش شفاف هزینه‌کرد')} ←
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/20 pt-5 text-xs opacity-80 sm:flex-row">
            <p>
              {t('footer.rights', 'کلیه حقوق این پایگاه به «کمیته امداد امام خمینی (ره)» تعلق دارد')} © {toPersianDigits(1404)}
            </p>
            <p className="flex items-center gap-1.5">
              <Languages size={13} />
              {lang === 'fa' ? 'طراحی مجدد با فناوری Next.js + دسترسی‌پذیری کامل' : 'Redesigned with Next.js + full accessibility'}
              {a11y.motion ? '' : ''}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
