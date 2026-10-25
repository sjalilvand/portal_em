import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

function trackingCode(): string {
  return `MPK-${Math.floor(100000 + Math.random() * 899999)}`;
}

/** POST /api/contribution → ثبت مشارکت (حامی‌پذیری/کمک) با کد رهگیری */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const kind = String(body.kind || '').trim();
    const category = String(body.category || '').trim();
    const name = String(body.name || '').trim();
    const mobile = String(body.mobile || '').trim();
    const amount = Number(body.amount || 0);
    const province = body.province ? String(body.province).trim() : null;
    const message = body.message ? String(body.message).trim().slice(0, 1000) : null;

    if (!['sponsor', 'donate'].includes(kind)) {
      return NextResponse.json({ error: 'نوع مشارکت نامعتبر است' }, { status: 400 });
    }
    if (!category || !name) {
      return NextResponse.json({ error: 'نوع کمک و نام الزامی است' }, { status: 400 });
    }
    if (!/^0?9\d{9}$/.test(mobile.replace(/\D/g, ''))) {
      return NextResponse.json({ error: 'شماره موبایل معتبر وارد کنید' }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount < 10000) {
      return NextResponse.json({ error: 'مبلغ حداقل ۱۰ هزار تومان است' }, { status: 400 });
    }

    let code = trackingCode();
    for (let i = 0; i < 5; i++) {
      const exists = await db.contribution.findUnique({ where: { trackingCode: code } });
      if (!exists) break;
      code = trackingCode();
    }

    const created = await db.contribution.create({
      data: { kind, category, amount: Math.round(amount), name, mobile, province, message, trackingCode: code },
    });

    return NextResponse.json({
      ok: true,
      trackingCode: created.trackingCode,
      amount: created.amount,
      createdAt: created.createdAt,
    });
  } catch (e) {
    console.error('POST /api/contribution error', e);
    return NextResponse.json({ error: 'خطا در ثبت مشارکت' }, { status: 500 });
  }
}

/** GET /api/contribution?code=MPK-123456 → استعلام رسید */
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')?.trim() || '';
    if (!code) {
      return NextResponse.json({ error: 'کد رهگیری الزامی است' }, { status: 400 });
    }
    const found = await db.contribution.findUnique({ where: { trackingCode: code } });
    if (!found) {
      return NextResponse.json({ error: 'مشارکتی با این کد یافت نشد' }, { status: 404 });
    }
    return NextResponse.json({
      trackingCode: found.trackingCode,
      kind: found.kind,
      category: found.category,
      amount: found.amount,
      createdAt: found.createdAt,
    });
  } catch (e) {
    console.error('GET /api/contribution error', e);
    return NextResponse.json({ error: 'خطا در استعلام' }, { status: 500 });
  }
}
