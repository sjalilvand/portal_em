import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

function trackingCode(): string {
  return `EMD-${Math.floor(100000 + Math.random() * 899999)}`;
}

/** POST /api/service-request → ثبت درخواست خدمت در میز خدمت الکترونیک */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const serviceId = String(body.serviceId || '').trim();
    const serviceTitle = String(body.serviceTitle || '').trim();
    const name = String(body.name || '').trim();
    const mobile = String(body.mobile || '').trim();
    const province = body.province ? String(body.province).trim() : null;
    const details = body.details ? String(body.details).trim().slice(0, 2000) : null;

    if (!serviceId || !serviceTitle) {
      return NextResponse.json({ error: 'خدمت مشخص نیست' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: 'نام و نام خانوادگی الزامی است' }, { status: 400 });
    }
    if (!/^0?9\d{9}$/.test(mobile.replace(/\D/g, ''))) {
      return NextResponse.json({ error: 'شماره موبایل معتبر وارد کنید' }, { status: 400 });
    }

    let code = trackingCode();
    for (let i = 0; i < 5; i++) {
      const exists = await db.serviceRequest.findUnique({ where: { trackingCode: code } });
      if (!exists) break;
      code = trackingCode();
    }

    const created = await db.serviceRequest.create({
      data: { serviceId, serviceTitle, name, mobile, province, details, trackingCode: code },
    });

    return NextResponse.json({
      ok: true,
      trackingCode: created.trackingCode,
      createdAt: created.createdAt,
    });
  } catch (e) {
    console.error('POST /api/service-request error', e);
    return NextResponse.json({ error: 'خطا در ثبت درخواست' }, { status: 500 });
  }
}

/** GET /api/service-request?code=EMD-123456 → پیگیری درخواست */
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')?.trim() || '';
    if (!code) {
      return NextResponse.json({ error: 'کد رهگیری الزامی است' }, { status: 400 });
    }
    const found = await db.serviceRequest.findUnique({ where: { trackingCode: code } });
    if (!found) {
      return NextResponse.json({ error: 'درخواستی با این کد یافت نشد' }, { status: 404 });
    }
    return NextResponse.json({
      trackingCode: found.trackingCode,
      serviceTitle: found.serviceTitle,
      status: found.status,
      createdAt: found.createdAt,
    });
  } catch (e) {
    console.error('GET /api/service-request error', e);
    return NextResponse.json({ error: 'خطا در پیگیری' }, { status: 500 });
  }
}
