import { PrismaInvoicesRepository } from "@/repositories/prisma-invoice-repository.js";

export async function getAllInvoicesService() {
  const prismaInvoicesRepository = new PrismaInvoicesRepository;

  const invoices = await prismaInvoicesRepository.getAllInvoices();

  return invoices;
}
