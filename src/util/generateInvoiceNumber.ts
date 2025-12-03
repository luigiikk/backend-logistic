import { prisma } from "@/lib/prisma.js";

export async function generateInvoiceNumber(): Promise<number> {
  let invoiceNumber = 0;
  let exists = true;

  while (exists) {
    invoiceNumber = Math.floor(10_000_000 + Math.random() * 90_000_000);

    const found = await prisma.invoice.findUnique({ where: { invoice_number: invoiceNumber } });
    exists = found !== null;
  }

  return invoiceNumber;
}
