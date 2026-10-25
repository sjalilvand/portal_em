import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/news/[id]/rate - rate a news item (1..5)
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const score = parseInt(body.score);
    if (!score || score < 1 || score > 5) {
      return NextResponse.json({ error: 'امتیاز باید بین ۱ تا ۵ باشد' }, { status: 400 });
    }
    const news = await db.news.findUnique({ where: { id } });
    if (!news) return NextResponse.json({ error: 'خبر یافت نشد' }, { status: 404 });

    await db.rating.create({ data: { newsId: id, score } });
    const agg = await db.rating.findMany({
      where: { newsId: id },
      select: { score: true },
    });
    const avg = agg.reduce((s, r) => s + r.score, 0) / agg.length;
    return NextResponse.json({
      ok: true,
      ratingAvg: Math.round(avg * 10) / 10,
      ratingCount: agg.length,
    });
  } catch (e) {
    console.error('POST /api/news/[id]/rate error', e);
    return NextResponse.json({ error: 'خطا در ثبت امتیاز' }, { status: 500 });
  }
}
