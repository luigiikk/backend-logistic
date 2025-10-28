import { prisma } from '@/lib/prisma.js';
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function resetDatabase() {
  await execAsync(
    'npx dotenv -e .env.test -- npx prisma migrate reset --force --skip-seed'
  )
}

export async function clearDatabase() {
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;

  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
    }
  }
}