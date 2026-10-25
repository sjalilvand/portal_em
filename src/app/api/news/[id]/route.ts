import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/news/[id] - single news, increments views
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const item = await db.news.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: { ratings: { select: { score: true } } },
    });
    if (!item) return NextResponse.json({ error: 'خبر یافت نشد' }, { status: 404 });
    const count = item.ratings.length;
    const avg = count > 0 ? item.ratings.reduce((s, r) => s + r.score, 0) / count : 0;
    return NextResponse.json({
      item: { ...item, ratingAvg: Math.round(avg * 10) / 10, ratingCount: count, ratings: undefined },
    });
  } catch (e) {
    console.error('GET /api/news/[id] error', e);
    return NextResponse.json({ error: 'خبر یافت نشد' }, { status: 404 });
  }
}

// PUT /api/news/[id] - update (admin)
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const existing = await db.news.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'خبر یافت نشد' }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).slice(0, 300);
    if (body.excerpt !== undefined) data.excerpt = String(body.excerpt).slice(0, 600);
    if (body.content !== undefined) data.content = String(body.content).slice(0, 20000);
    if (body.category !== undefined) data.category = body.category;
    if (body.province !== undefined) data.province = body.province || null;
    if (body.image !== undefined) data.image = body.image || null;
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.published !== undefined) data.published = Boolean(body.published);

    const updated = await db.news.update({ where: { id }, data });
    return NextResponse.json({ item: updated });
  } catch (e) {
    console.error('PUT /api/news/[id] error', e);
    return NextResponse.json({ error: 'خطا در ویرایش خبر' }, { status: 500 });
  }
}

// DELETE /api/news/[id] - delete (admin)
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await db.news.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/news/[id] error', e);
    return NextResponse.json({ error: 'خطا در حذف خبر' }, { status: 500 });
  }
}
