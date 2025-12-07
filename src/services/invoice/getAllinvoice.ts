import { PrismaInvoicesRepository } from "@/repositories/prisma-invoice-repository.js";

export async function getAllInvoicesService(company_id: number) {
  const prismaInvoicesRepository = new PrismaInvoicesRepository;

  const invoices = await prismaInvoicesRepository.getAllInvoices(company_id);

  return invoices;
}
