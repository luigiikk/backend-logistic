import { prisma } from "../src/lib/prisma.js"

async function main() {
  // STATUS
  const existingStatuses = await prisma.status.findMany({
    where: { company_id: null },
    select: { name: true, type: true }
  });
  
  const existingStatusKeys = new Set(existingStatuses.map(s => `${s.name.trim().toLowerCase()}-${s.type.trim().toLowerCase()}`));

  const statusesToCreate = [
    // Veículos
    { name: "Ativo", type: "vehicle", is_default: true, company_id: null },
    { name: "Manutenção", type: "vehicle", is_default: false, company_id: null },
    { name: "Inativo", type: "vehicle", is_default: false, company_id: null },
    
    // Pedidos
    { name: "Pendente", type: "order", is_default: true, company_id: null },
    { name: "Em Processo", type: "order", is_default: false, company_id: null },
    { name: "Em Trânsito", type: "order", is_default: false, company_id: null },
    { name: "Entregue", type: "order", is_default: false, company_id: null },
    { name: "Cancelado", type: "order", is_default: false, company_id: null },
    
    // Faturas
    { name: "Pendente", type: "invoice", is_default: true, company_id: null },
    { name: "Paga", type: "invoice", is_default: false, company_id: null },
    { name: "Cancelada", type: "invoice", is_default: false, company_id: null },
    
    // Pedidos de Compra
    { name: "Pendente", type: "purchase_order", is_default: true, company_id: null },
    { name: "Aprovado", type: "purchase_order", is_default: false, company_id: null },
    { name: "Recebido", type: "purchase_order", is_default: false, company_id: null },
    { name: "Cancelado", type: "purchase_order", is_default: false, company_id: null },
  ].filter(s => !existingStatusKeys.has(`${s.name.trim().toLowerCase()}-${s.type.trim().toLowerCase()}`));

  if (statusesToCreate.length > 0) {
    await prisma.status.createMany({ data: statusesToCreate });
  }

  // ROLES
  const existingRoles = await prisma.roles.findMany({
    select: { name: true }
  });
  
  const existingRoleNames = new Set(existingRoles.map(r => r.name ? r.name.trim().toLowerCase() : ""));

  const rolesToCreate = [
    { name: "Administrador" },
    { name: "Gerente" },
    { name: "Estoquista" },
    { name: "Motorista" },
    { name: "Operador Logístico" },
    { name: "Comprador" },
    { name: "Financeiro" },
  ].filter(r => !existingRoleNames.has(r.name.trim().toLowerCase()));

  if (rolesToCreate.length > 0) {
    await prisma.roles.createMany({ data: rolesToCreate });
  }

  // CATEGORY RESOURCE
  const existingCategories = await prisma.category_Resource.findMany({
    select: { name: true }
  });
  
  const existingCategoryNames = new Set(existingCategories.map(c => c.name ? c.name.trim().toLowerCase() : ""));

  const categoriesToCreate = [
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
  ].filter(c => !existingCategoryNames.has(c.name.trim().toLowerCase()));

  if (categoriesToCreate.length > 0) {
    await prisma.category_Resource.createMany({ data: categoriesToCreate });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());