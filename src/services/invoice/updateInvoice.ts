import { PrismaInvoicesRepository } from "@/repositories/prisma-invoice-repository.js";

export interface InvoiceUpdateParams {
  client_id: number;
  recipient_id: number;
  issue_date: Date;
  due_date: Date;
  total_amount: number;
  tax_amount: number;
  status_id: number;
  link_file: string;
}

export async function updateInvoiceService(
  id: number,
  {
    client_id,
    recipient_id,
    issue_date,
    due_date,
    total_amount,
    tax_amount,
    status_id,
    link_file,
  }: InvoiceUpdateParams
) {
  const prismaInvoicesRepository = new PrismaInvoicesRepository();

  await prismaInvoicesRepository.updateInvoice(id, {
    client_id,
    recipient_id,
    issue_date,
    due_date,
    total_amount,
    tax_amount,
    status_id,
    link_file,
  });
}
