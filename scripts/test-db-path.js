// Test: verify relative DATABASE_URL resolves correctly (Windows-compatible)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newsCount = await prisma.news.count();
  const ratingCount = await prisma.rating.count();
  const sample = await prisma.news.findFirst({ select: { title: true, category: true } });
  console.log('✅ DB connection OK (relative path works)');
  console.log(`   News: ${newsCount} | Ratings: ${ratingCount}`);
  console.log(`   Sample: ${sample ? sample.title : 'none'}`);
}

main().catch((e) => { console.error('❌ DB ERROR:', e.message); process.exit(1); }).finally(() => prisma.$disconnect());
