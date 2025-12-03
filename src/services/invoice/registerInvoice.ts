import { PrismaInvoicesRepository } from "@/repositories/prisma-invoice-repository.js";
import { generateInvoiceNumber } from "@/util/generateInvoiceNumber.js";

interface InvoiceRegisterParams {
  client_id: number;
  recipient_id: number;
  issue_date: Date;
  due_date: Date;
  total_amount: number;
  tax_amount: number;
  status_id: number;
  link_file: string;
}

export async function registerInvoiceService({
    client_id,
    recipient_id,
    issue_date,
    due_date,
    total_amount,
    tax_amount,
    status_id,
    link_file,
}: InvoiceRegisterParams) {

  const invoice_number = await generateInvoiceNumber();

  const prismaInvoicesRepository = new PrismaInvoicesRepository();

  const invoice = await prismaInvoicesRepository.create({
    client: {connect: {id: client_id}},
    recipient: {connect: {id: recipient_id}},
    invoice_number,
    issue_date,
    due_date,
    total_amount,
    tax_amount,
    status: {connect: {id: status_id}},
    link_file,
  });
  return invoice;
}
