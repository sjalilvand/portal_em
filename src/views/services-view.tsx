'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  Info,
  ListChecks,
  Search,
  Wallet,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SERVICES, type PortalService } from '@/lib/portal-data';
import { toPersianDigits } from '@/lib/settings';
import { PortalIcon, Reveal, SectionTitle, EmptyState } from '@/components/portal/widgets';
import { cn } from '@/lib/utils';

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

function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-xs font-black text-primary">{label}</p>
        <p className="mt-1 text-[13px] leading-7">{value}</p>
      </div>
    </div>
  );
}

export function ServiceDetailDialog({
  service,
  onClose,
}: {
  service: PortalService;
  onClose: () => void;
}) {
  const specMap = useMemo(() => {
    const m = new Map<string, string>();
    service.specs.forEach((s) => m.set(s.key, s.value));
    return m;
  }, [service]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.96 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        role="dialog"
        aria-label={`مشخصات ${service.title}`}
        className="fixed inset-x-4 top-[4vh] z-[95] mx-auto max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border bg-background shadow-2xl scroll-thin"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className={cn('flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md', SERVICE_COLORS[service.color] || 'from-emerald-500 to-teal-600')}>
              <PortalIcon name={service.icon} size={22} />
            </span>
            <div>
              <h3 className="text-base font-black">{service.title}</h3>
              <p className="text-[11px] text-muted-foreground">مشخصات و شرایط دریافت خدمت</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="rounded-xl p-2 transition-colors hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm leading-8 text-muted-foreground">{service.desc}</p>

          <div className="grid gap-2.5">
            <SpecRow
              icon={<Wallet size={15} />}
              label={service.specs[0]?.label || 'میزان کمک'}
              value={specMap.get('mablagh') || '-'}
            />
            <SpecRow
              icon={<CheckCircle2 size={15} />}
              label={service.specs[1]?.label || 'شرایط'}
              value={specMap.get('sharat') || '-'}
            />
            <SpecRow
              icon={<FileText size={15} />}
              label="مدارک لازم"
              value={specMap.get('madarek') || '-'}
            />
            <SpecRow
              icon={<ListChecks size={15} />}
              label="مراحل دریافت خدمت"
              value={specMap.get('marhale') || '-'}
            />
            <SpecRow
              icon={<Clock size={15} />}
              label="زمان پاسخگویی"
              value={specMap.get('zaman') || '-'}
            />
            <SpecRow
              icon={<Globe size={15} />}
              label="کانال دریافت خدمت"
              value={specMap.get('kanal') || '-'}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-muted/60 p-4">
            <Info size={16} className="text-primary" />
            <p className="text-xs leading-6">
              برای شروع، از طریق «میز خدمات الکترونیک» درخواست خود را ثبت کنید یا با مرکز تماس{' '}
              <b>۱۴۹۸</b> تماس بگیرید.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ServicesView({
  initialService,
  onOpenService,
}: {
  initialService?: string;
  onOpenService: (id: string) => void;
}) {
  const [q, setQ] = useState('');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [selected, setSelected] = useState<PortalService | null>(
    SERVICES.find((s) => s.id === initialService) || null
  );

  React.useEffect(() => {
    if (initialService) {
      const s = SERVICES.find((x) => x.id === initialService);
      if (s) setSelected(s);
    }
  }, [initialService]);

  const filtered = SERVICES.filter((s) => {
    if (onlyOnline && !s.online) return false;
    if (!q.trim()) return true;
    return s.title.includes(q.trim()) || s.short.includes(q.trim()) || s.desc.includes(q.trim());
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <SectionTitle
        eyebrow="میز خدمت الکترونیک"
        title="خدمات و مشخصات کامل آن‌ها"
        desc="۱۱ خدمت اصلی کمیته امداد با جزئیات کامل: مبلغ، شرایط، مدارک لازم، مراحل و زمان پاسخگویی. روی هر خدمت کلیک کنید."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی خدمت..."
            className="rounded-xl ps-9"
          />
        </div>
        <Button
          variant={onlyOnline ? 'default' : 'outline'}
          onClick={() => setOnlyOnline(!onlyOnline)}
          className="gap-2 rounded-full"
        >
          <Globe size={15} />
          {onlyOnline ? 'همه خدمات' : 'فقط خدمات آنلاین'}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="خدمتی یافت نشد" desc="عبارت دیگری را جستجو کنید" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <Card
                className="group h-full cursor-pointer card-hover gradient-border"
                onClick={() => { setSelected(s); onOpenService(s.id); }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6',
                        SERVICE_COLORS[s.color] || 'from-emerald-500 to-teal-600'
                      )}
                    >
                      <PortalIcon name={s.icon} size={22} />
                    </span>
                    {s.online ? (
                      <Badge className="gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        <Globe size={11} /> آنلاین
                      </Badge>
                    ) : (
                      <Badge variant="secondary">حضوری</Badge>
                    )}
                  </div>
                  <h3 className="mt-4 text-[15px] font-black leading-7">{s.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-muted-foreground">{s.short}</p>
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <ListChecks size={13} />
                      {toPersianDigits(s.specs.length)} مشخصه خدمت
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      مشاهده جزئیات <ArrowRight size={14} className="rotate-180" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && <ServiceDetailDialog service={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
