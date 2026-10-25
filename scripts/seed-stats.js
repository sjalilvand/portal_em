// Initialize visitor stats baseline (one-time)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function jalaliToday() {
  try {
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(new Date())
      .replace(/\//g, '/');
  } catch {
    return '';
  }
}

async function main() {
  await prisma.visitorStat.upsert({
    where: { id: 'global' },
    update: { day: jalaliToday() },
    create: {
      id: 'global',
      day: jalaliToday(),
      totalViews: 1067277,
      totalVisitors: 280477,
      todayViews: 1843,
      todayVisitors: 612,
    },
  });
  console.log('✅ VisitorStat baseline ready');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
