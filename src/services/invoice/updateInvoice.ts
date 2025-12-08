import { PrismaInvoicesRepository } from "@/repositories/prisma-invoice-repository.js";

export interface InvoiceUpdateParams {
  issue_date: Date;
  due_date: Date;
  link_file: string;
}

export async function updateInvoiceService(
  id: number,
  company_id: number,
  {
    issue_date,
    due_date,
    link_file,
  }: InvoiceUpdateParams
) {
  const prismaInvoicesRepository = new PrismaInvoicesRepository();

  await prismaInvoicesRepository.updateInvoice(id, company_id, {
    issue_date,
    due_date,
    link_file,
  });
}
