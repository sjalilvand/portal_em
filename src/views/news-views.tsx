'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Eye,
  Filter,
  Flame,
  MapPin,
  Newspaper,
  Pause,
  Play,
  Search,
  Share2,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROVINCES } from '@/lib/portal-data';
import { formatPersianDate, formatPersianNumber, toPersianDigits } from '@/lib/settings';
import {
  EmptyState,
  PersianDateBadge,
  Reveal,
  SectionTitle,
  StarRating,
} from '@/components/portal/widgets';
import type { NewsCardItem } from '@/components/portal/home2';

export interface NewsViewNav {
  go: (view: import('@/lib/portal-data').ViewName, params?: Record<string, string>) => void;
}

const NEWS_CATEGORIES = [
  'همه',
  'اشتغال و توانمندسازی',
  'سلامت و درمان',
  'فرهنگی و اجتماعی',
  'ازدواج و جهیزیه',
  'کمک معیشت',
  'تحصیل و اکرام',
  'مشارکت‌های مردمی',
  'مسکن',
  'وام قرض‌الحسنه',
  'امور بین‌الملل',
  'اخبار',
];

/* ================= News List ================= */

export function NewsListView({
  nav,
  initialCategory,
  initialSearch,
}: {
  nav: NewsViewNav;
  initialCategory?: string;
  initialSearch?: string;
}) {
  const [items, setItems] = useState<NewsCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory || 'همه');
  const [province, setProvince] = useState('همه');
  const [search, setSearch] = useState(initialSearch || '');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    let active = true;
    (async () => {
      await Promise.resolve();
      if (!active) return;
      setLoading(true);
      const sp = new URLSearchParams({ limit: '30' });
      if (category !== 'همه') sp.set('category', category);
      if (province !== 'همه') sp.set('province', province);
      if (search.trim()) sp.set('search', search.trim());
      try {
        const res = await fetch(`/api/news?${sp.toString()}`);
        const d = await res.json();
        if (!active) return;
        let list: NewsCardItem[] = d.items || [];
        if (sort === 'rating') list = [...list].sort((a, b) => b.ratingAvg - a.ratingAvg);
        if (sort === 'views') list = [...list].sort((a, b) => b.views - a.views);
        setItems(list);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [category, province, search, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <SectionTitle
        eyebrow="پایگاه اطلاع‌رسانی"
        title="اخبار و اطلاع‌رسانی"
        desc="آخرین رویدادها و اطلاعیه‌های کمیته امداد؛ می‌توانید به هر خبر امتیاز دهید و آن را فیلتر کنید."
      />

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-2.5 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="relative min-w-52 flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در عنوان و متن اخبار..."
            className="rounded-xl ps-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44 rounded-xl" aria-label="دسته‌بندی">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NEWS_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="w-40 rounded-xl" aria-label="استان">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="همه">همه استان‌ها</SelectItem>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-36 rounded-xl" aria-label="مرتب‌سازی">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">جدیدترین</SelectItem>
            <SelectItem value="rating">بیشترین امتیاز</SelectItem>
            <SelectItem value="views">پربازدیدترین</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-44 shimmer bg-muted" />
              <CardContent className="space-y-3 p-5">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="خبری با این فیلترها یافت نشد" desc="فیلترها را تغییر دهید یا جستجوی دیگری امتحان کنید" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.04}>
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
                  <Badge variant="secondary" className="absolute bottom-3 right-3 backdrop-blur">{n.category}</Badge>
                  {n.province && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white backdrop-blur">
                      <MapPin size={11} /> {n.province}
                    </span>
                  )}
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
  );
}

/* ================= News Detail ================= */

export function NewsDetailView({
  nav,
  id,
}: {
  nav: NewsViewNav;
  id: string;
}) {
  const [item, setItem] = useState<(NewsCardItem & { content: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news/${id}`)
      .then((r) => r.json())
      .then((d) => setItem(d.item || null))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0 });
  }, [id]);

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(`${item?.title}. ${item?.content}`);
    utter.lang = 'fa-IR';
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const share = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ title: item?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        const { toast } = await import('sonner');
        toast.success('لینک خبر کپی شد');
      }
    } catch {
      /* cancelled */
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-80 shimmer rounded-3xl bg-muted" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState title="خبر یافت نشد" desc="ممکن است خبر حذف شده باشد" />
        <div className="text-center">
          <Button onClick={() => nav.go('news')} className="gap-2 rounded-full">
            <ArrowRight size={16} /> بازگشت به اخبار
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl px-4 py-10"
    >
      <button
        onClick={() => nav.go('news')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
      >
        <ArrowRight size={16} /> بازگشت به اخبار
      </button>

      <Card className="overflow-hidden border shadow-xl">
        <div className="relative h-64 sm:h-80">
          {item.image ? (
             
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center hero-gradient">
              <Newspaper size={56} className="text-white/70" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 right-4 left-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">{item.category}</Badge>
              {item.province && (
                <Badge variant="secondary" className="gap-1 backdrop-blur">
                  <MapPin size={11} /> {item.province}
                </Badge>
              )}
              {item.featured && (
                <Badge className="gap-1 bg-amber-500 text-white">
                  <Flame size={12} /> ویژه
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8">
          <h1 className="text-xl font-black leading-9 sm:text-2xl">{item.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-b pb-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> <PersianDateBadge date={item.createdAt} />
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} /> {formatPersianNumber(item.views)} بازدید
            </span>
            <span className="flex-1" />
            <StarRating
              newsId={item.id}
              avg={item.ratingAvg}
              count={item.ratingCount}
              interactive
              size={18}
            />
          </div>

          <p className="mt-6 rounded-2xl bg-muted/60 p-4 text-sm font-bold leading-8">
            {item.excerpt}
          </p>

          <div className="mt-6 space-y-4 text-[15px] leading-9">
            {item.content.split('\n').filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2 border-t pt-5">
            <Button variant="secondary" size="sm" onClick={speak} className="gap-2 rounded-full">
              {speaking ? <Pause size={15} /> : <Volume2 size={15} />}
              {speaking ? 'توقف خواندن' : 'گوش دادن به خبر'}
            </Button>
            <Button variant="secondary" size="sm" onClick={share} className="gap-2 rounded-full">
              <Share2 size={15} /> اشتراک‌گذاری
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}
