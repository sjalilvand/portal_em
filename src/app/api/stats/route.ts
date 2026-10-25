import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

function jalaliToday(): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    return '';
  }
}

/** GET /api/stats → aggregate visitor statistics */
export async function GET() {
  try {
    const stat = await db.visitorStat.findUnique({ where: { id: 'global' } });
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const online = await db.visitLog.count({
      where: { lastSeen: { gte: fiveMinAgo } },
    });
    const browsers = await db.visitLog.groupBy({
      by: ['browser'],
      _count: { browser: true },
      where: { browser: { not: '' } },
      orderBy: { _count: { browser: 'desc' } },
      take: 1,
    });
    return NextResponse.json({
      totalViews: stat?.totalViews ?? 0,
      totalVisitors: stat?.totalVisitors ?? 0,
      todayViews: stat?.todayViews ?? 0,
      todayVisitors: stat?.todayVisitors ?? 0,
      online,
      topBrowser: browsers[0]?.browser || 'Chrome',
    });
  } catch (e) {
    console.error('GET /api/stats error', e);
    return NextResponse.json({ error: 'خطا در خواندن آمار' }, { status: 500 });
  }
}

/** POST /api/stats { sessionId, browser } → record visit / heartbeat */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = String(body.sessionId || '').slice(0, 64);
    const browser = String(body.browser || '').slice(0, 40);
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId الزامی است' }, { status: 400 });
    }

    const today = jalaliToday();
    const isNew = (await db.visitLog.findUnique({ where: { sessionId } })) === null;

    await db.visitLog.upsert({
      where: { sessionId },
      update: { lastSeen: new Date(), browser: browser || undefined },
      create: { sessionId, browser },
    });

    await db.visitorStat.upsert({
      where: { id: 'global' },
      update: {},
      create: { id: 'global' },
    });

    // Reset today counters on day change, then increment
    const stat = (await db.visitorStat.findUnique({ where: { id: 'global' } }))!;
    const resetToday = stat.day !== today;
    await db.visitorStat.update({
      where: { id: 'global' },
      data: {
        day: today,
        totalViews: { increment: 1 },
        todayViews: resetToday ? 1 : { increment: 1 },
        totalVisitors: isNew ? { increment: 1 } : undefined,
        todayVisitors: isNew ? (resetToday ? 1 : { increment: 1 }) : undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/stats error', e);
    return NextResponse.json({ error: 'خطا در ثبت بازدید' }, { status: 500 });
  }
}
