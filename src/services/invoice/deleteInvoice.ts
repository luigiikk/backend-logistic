import { prisma } from "@/lib/prisma.js";
import { PrismaInvoicesRepository } from "@/repositories/prisma-invoice-repository.js";

export async function deleteInvoiceService(id: number) {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
    }
  })
  
  if(!invoice){
    throw new Error('invoice not exists');
  }

  const prismaInvoicesRepository = new PrismaInvoicesRepository;

  try {
    await prismaInvoicesRepository.deleteInvoice(invoice.id);
  } catch(error) {
    throw new Error("Error deleting invoice");
  }
  
}
