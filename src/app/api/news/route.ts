import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/news?category=&province=&search=&featured=&limit=&page=&includeUnpublished=1
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const category = sp.get('category') || undefined;
    const province = sp.get('province') || undefined;
    const search = sp.get('search') || undefined;
    const featured = sp.get('featured');
    const limit = Math.min(parseInt(sp.get('limit') || '50'), 100);
    const page = Math.max(parseInt(sp.get('page') || '1'), 1);
    const includeUnpublished = sp.get('includeUnpublished') === '1';

    const where: Record<string, unknown> = {};
    if (!includeUnpublished) where.published = true;
    if (category && category !== 'همه') where.category = category;
    if (province && province !== 'همه') where.province = province;
    if (featured === '1') where.featured = true;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      db.news.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          ratings: { select: { score: true } },
        },
      }),
      db.news.count({ where }),
    ]);

    const mapped = items.map((n) => {
      const count = n.ratings.length;
      const avg = count > 0 ? n.ratings.reduce((s, r) => s + r.score, 0) / count : 0;
      return {
        ...n,
        ratingAvg: Math.round(avg * 10) / 10,
        ratingCount: count,
        ratings: undefined,
      };
    });

    return NextResponse.json({ items: mapped, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error('GET /api/news error', e);
    return NextResponse.json({ error: 'خطا در دریافت اخبار' }, { status: 500 });
  }
}

// POST /api/news - create news (admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, excerpt, content, category, province, image, featured, published } = body;
    if (!title || !excerpt || !content) {
      return NextResponse.json({ error: 'عنوان، خلاصه و متن خبر الزامی است' }, { status: 400 });
    }
    const created = await db.news.create({
      data: {
        title: String(title).slice(0, 300),
        excerpt: String(excerpt).slice(0, 600),
        content: String(content).slice(0, 20000),
        category: category || 'اخبار',
        province: province || null,
        image: image || null,
        featured: Boolean(featured),
        published: published !== false,
      },
    });
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (e) {
    console.error('POST /api/news error', e);
    return NextResponse.json({ error: 'خطا در ایجاد خبر' }, { status: 500 });
  }
}
