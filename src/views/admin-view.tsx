'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Lock,
  Newspaper,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROVINCES } from '@/lib/portal-data';
import { formatPersianNumber, formatPersianDate, toPersianDigits } from '@/lib/settings';
import { EmptyState, SectionTitle, StarRating } from '@/components/portal/widgets';
import { toast } from 'sonner';

const CATEGORIES = [
  'اخبار',
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
];

const ADMIN_KEY = 'emdad-admin-session';

interface AdminNews {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  province: string | null;
  image: string | null;
  featured: boolean;
  published: boolean;
  views: number;
  createdAt: string;
  ratingAvg: number;
  ratingCount: number;
}

/* Image resize helper: keeps DB small & loading fast */
async function fileToResizedDataUrl(file: File, maxW = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AdminView({ nav }: { nav: { go: (v: 'news', p?: Record<string, string>) => void } }) {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [items, setItems] = useState<AdminNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<AdminNews | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);

  // form fields
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('اخبار');
  const [province, setProvince] = useState('none');
  const [image, setImage] = useState<string | null>(null);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    setAuthed(localStorage.getItem(ADMIN_KEY) === '1');
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news?limit=100&includeUnpublished=1');
      const d = await res.json();
      setItems(d.items || []);
    } catch {
      toast.error('خطا در دریافت لیست اخبار');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadItems();
  }, [authed]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (pass === 'emdad1404') {
      localStorage.setItem(ADMIN_KEY, '1');
      setAuthed(true);
      toast.success('خوش آمدید! ورود موفق بود');
    } else {
      toast.error('رمز نادرست است');
    }
  }

  function openCreate() {
    setEditing(null);
    setTitle(''); setExcerpt(''); setContent('');
    setCategory('اخبار'); setProvince('none'); setImage(null);
    setFeatured(false); setPublished(true);
    setCreating(true);
  }

  function openEdit(n: AdminNews) {
    setEditing(n);
    setTitle(n.title); setExcerpt(n.excerpt); setContent(n.content);
    setCategory(n.category); setProvince(n.province || 'none'); setImage(n.image);
    setFeatured(n.featured); setPublished(n.published);
    setCreating(true);
  }

  async function save() {
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error('عنوان، خلاصه و متن خبر الزامی است');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title, excerpt, content, category,
        province: province === 'none' ? null : province,
        image, featured, published,
      };
      const res = editing
        ? await fetch(`/api/news/${editing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success(editing ? 'خبر با موفقیت ویرایش شد' : 'خبر جدید با موفقیت منتشر شد');
      setCreating(false);
      loadItems();
    } catch {
      toast.error('ذخیره‌سازی ناموفق بود');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(n: AdminNews) {
    try {
      await fetch(`/api/news/${n.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !n.published }),
      });
      setItems((list) => list.map((x) => (x.id === n.id ? { ...x, published: !n.published } : x)));
      toast.success(n.published ? 'خبر پیش‌نویس شد' : 'خبر منتشر شد');
    } catch {
      toast.error('خطا در تغییر وضعیت');
    }
  }

  async function remove(n: AdminNews) {
    if (!confirm(`حذف خبر «${n.title.slice(0, 40)}...»؟`)) return;
    try {
      await fetch(`/api/news/${n.id}`, { method: 'DELETE' });
      setItems((list) => list.filter((x) => x.id !== n.id));
      toast.success('خبر حذف شد');
    } catch {
      toast.error('حذف ناموفق بود');
    }
  }

  async function onImagePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      toast.error('حجم تصویر حداکثر ۸ مگابایت');
      return;
    }
    setImgBusy(true);
    try {
      const dataUrl = await fileToResizedDataUrl(f);
      setImage(dataUrl);
      toast.success('تصویر بارگذاری شد');
    } catch {
      toast.error('خطا در پردازش تصویر');
    } finally {
      setImgBusy(false);
    }
  }

  /* ---------- Login screen ---------- */
  if (!authed) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
        <Card className="w-full border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl hero-gradient text-primary-foreground shadow-lg">
              <Lock size={26} />
            </span>
            <h2 className="text-lg font-black">ورود مدیران محتوا</h2>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              برای نوشتن و انتشار اخبار، رمز عبور مدیریتی را وارد کنید.
              <br />
              (رمز نمایشی: <b>emdad1404</b>)
            </p>
            <form onSubmit={login} className="mt-6 space-y-4">
              <Input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="رمز عبور"
                className="rounded-xl text-center"
              />
              <Button type="submit" className="w-full gap-2 rounded-xl">
                ورود به پنل مدیریت
              </Button>
              <Button type="button" variant="ghost" onClick={() => nav.go('news')} className="w-full gap-2 text-muted-foreground">
                <ArrowRight size={15} /> بازگشت به اخبار
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- Editor ---------- */
  if (creating) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <SectionTitle
          eyebrow="پنل مدیریت"
          title={editing ? 'ویرایش خبر' : 'نوشتن خبر جدید'}
          desc="عنوان، خلاصه، متن، دسته‌بندی، استان و تصویر خبر را وارد کنید."
        />
        <Card className="border-0 shadow-xl">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label>عنوان خبر *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان جذاب خبر..." className="rounded-xl font-bold" />
            </div>
            <div className="space-y-1.5">
              <Label>خلاصه خبر *</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="خلاصه یک تا دو خطی برای نمایش در کارت خبر..." className="min-h-20 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>متن کامل خبر *</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="متن کامل خبر؛ هر پاراگراف را با Enter جدا کنید..." className="min-h-44 rounded-xl" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>دسته‌بندی</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>استان</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="none">سراسری (بدون استان)</SelectItem>
                    {PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image */}
            <div className="space-y-1.5">
              <Label>تصویر خبر</Label>
              {image ? (
                <div className="relative overflow-hidden rounded-2xl border">
                  
                  <img src={image} alt="پیش‌نمایش" className="h-44 w-full object-cover" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute left-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-red-600"
                    aria-label="حذف تصویر"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-muted/40 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                  {imgBusy ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={22} />}
                  <span className="text-xs font-bold">{imgBusy ? 'در حال پردازش...' : 'انتخاب تصویر (حداکثر ۸ مگ)'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={onImagePicked} />
                </label>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Switch checked={featured} onCheckedChange={setFeatured} id="f-feat" />
                <Label htmlFor="f-feat" className="cursor-pointer">خبر ویژه (نمایش در اسلایدر اخبار)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={published} onCheckedChange={setPublished} id="f-pub" />
                <Label htmlFor="f-pub" className="cursor-pointer">انتشار فوری</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={save} disabled={saving} className="flex-1 gap-2 rounded-2xl">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {editing ? 'ذخیره تغییرات' : 'انتشار خبر'}
              </Button>
              <Button variant="outline" onClick={() => setCreating(false)} className="rounded-2xl">
                انصراف
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- List ---------- */
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="پنل مدیریت"
          title="مدیریت اخبار"
          desc="ایجاد، ویرایش، انتشار و حذف اخبار؛ آمار بازدید و امتیاز هر خبر را ببینید."
        />
        <div className="mb-8 flex gap-2">
          <Button onClick={openCreate} className="gap-2 rounded-full">
            <Plus size={16} /> خبر جدید
          </Button>
          <Button variant="outline" onClick={() => nav.go('news')} className="gap-2 rounded-full">
            <Newspaper size={15} /> مشاهده سایت
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 shimmer rounded-2xl bg-muted" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="هنوز خبری ثبت نشده" desc="با دکمه «خبر جدید» اولین خبر را منتشر کنید" />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card key={n.id} className="overflow-hidden card-hover">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {n.image ? (
                     
                    <img src={n.image} alt={n.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center hero-gradient">
                      <Newspaper size={18} className="text-white/70" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">{n.category}</Badge>
                    {n.featured && <Badge className="bg-amber-500 text-[10px] text-white">ویژه</Badge>}
                    {!n.published && <Badge variant="destructive" className="text-[10px]">پیش‌نویس</Badge>}
                  </div>
                  <p className="mt-1 truncate text-sm font-bold">{n.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span>{formatPersianDate(n.createdAt)}</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {formatPersianNumber(n.views)}</span>
                    <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {toPersianDigits(n.ratingAvg.toFixed(1))} ({formatPersianNumber(n.ratingCount)})</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => togglePublish(n)}
                    title={n.published ? 'پیش‌نویس' : 'انتشار'}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    {n.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => openEdit(n)}
                    title="ویرایش"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(n)}
                    title="حذف"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
