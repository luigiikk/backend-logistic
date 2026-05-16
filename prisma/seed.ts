import { prisma } from "../src/lib/prisma"

async function main() {
  // STATUS
  await prisma.status.createMany({
    skipDuplicates: true,
    data: [
      { name: "Ativo",    type: "vehicle",         is_default: true, company_id: null },
      { name: "Pendente", type: "order",           is_default: true, company_id: null },
      { name: "Pendente", type: "invoice",         is_default: true, company_id: null },
      { name: "Pendente", type: "purchase_order", is_default: true, company_id: null },
    ],
  });

  // ROLES
  await prisma.roles.createMany({
    skipDuplicates: true,
    data: [
      { name: "Administrador" },
      { name: "Gerente" },
      { name: "Estoquista" },
      { name: "Motorista" },
      { name: "Operador Logístico" },
      { name: "Comprador" },
      { name: "Financeiro" },
    ],
  });

  // CATEGORY RESOURCE
  await prisma.category_Resource.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Eletrônicos",
        description: "Equipamentos e dispositivos eletrônicos",
      },
      {
        name: "Móveis",
        description: "Mesas, cadeiras, armários e mobiliário",
      },
      {
        name: "Ferramentas",
        description: "Ferramentas manuais e elétricas",
      },
      {
        name: "Materiais de Escritório",
        description: "Itens utilizados em escritório",
      },
      {
        name: "Peças Automotivas",
        description: "Peças e acessórios para veículos",
      },
      {
        name: "Equipamentos de Segurança",
        description: "EPIs e itens de proteção",
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());