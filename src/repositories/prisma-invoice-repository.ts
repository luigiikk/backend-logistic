import { prisma } from "@/lib/prisma.js";
import { InvoiceUpdateParams } from "@/services/invoice/updateInvoice.js";
import { Prisma } from "@prisma/client";

export class PrismaInvoicesRepository {
  async create(data: Prisma.InvoiceCreateInput) {
    const invoice = await prisma.invoice.create({
      data,
    });

    return invoice;
  }

  async getAllInvoices() {
    return await prisma.invoice.findMany({
      select: {
        id: true,
        recipient_id: true,
        client_id: true,
        invoice_number: true,
        issue_date: true,
        due_date: true,
        total_amount: true,
        tax_amount: true,
        status_id: true,
        link_file: true,
      },
    });
  }

  async getInvoice(id: number) {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
      },
    });

    return invoice;
  }

  async deleteInvoice(id: number) {
    await prisma.invoice.delete({
      where: {
        id,
      },
    });
  }

  async updateInvoice(id: number, data: InvoiceUpdateParams) {
      const invoiceExists = await prisma.invoice.findUnique({ where: { id } });
  
      if (!invoiceExists) {
        throw new Error("invoice not found");
      }
      await prisma.invoice.update({
        where: { id },
        data,
      });
    }
}
