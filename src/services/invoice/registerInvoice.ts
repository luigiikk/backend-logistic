import { PrismaInvoicesRepository } from "@/repositories/prisma-invoice-repository.js";
import { generateInvoiceNumber } from "@/util/generateInvoiceNumber.js";

interface InvoiceRegisterParams {
  company_id: number;
  purchase_order_id: number;
  issue_date: Date;
  due_date: Date;
  link_file: string;
}

export async function registerInvoiceService({
  company_id,
  purchase_order_id, 
  issue_date,
  due_date,
  link_file,
}: InvoiceRegisterParams) {
  
  const invoice_number = await generateInvoiceNumber();
  const prismaInvoicesRepository = new PrismaInvoicesRepository();

  const invoice = await prismaInvoicesRepository.create({
    company_id,
    purchase_order_id, 
    invoice_number,
    issue_date,
    due_date,
    link_file,
  });

  return invoice;
}