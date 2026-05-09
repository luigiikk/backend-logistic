import { prisma } from "../src/lib/prisma"

async function main() {
  await prisma.status.createMany({
    skipDuplicates: true,
    data: [
      { name: "Ativo",    type: "vehicle",        is_default: true, company_id: null },
      { name: "Pendente", type: "order",           is_default: true, company_id: null },
      { name: "Pendente", type: "invoice",         is_default: true, company_id: null },
      { name: "Pendente", type: "purchase_order",  is_default: true, company_id: null },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());