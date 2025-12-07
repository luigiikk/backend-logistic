import { PrismaInvoicesRepository } from "@/repositories/prisma-invoice-repository.js";

export async function getInvoiceService(id: number, company_id: number) {
  const prismaInvoicesRepository = new PrismaInvoicesRepository;

  const invoice = await prismaInvoicesRepository.getInvoice(id, company_id);

  if(!invoice){
    throw new Error('invoice not found');
  }
  return invoice;
}
