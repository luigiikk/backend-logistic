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

  async getAllInvoices(company_id: number) {
    const invoice = await prisma.invoice.findMany({
      where: {
        company_id,
      },
      include: {
        purchase_order: true
      }
    });

    return invoice;
  }

  async getInvoice(id: number, company_id: number) {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
        company_id,
      },
      include: {
        purchase_order: true
      }
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

  async updateInvoice(id: number, company_id: number, data: InvoiceUpdateParams) {
      await prisma.invoice.update({
        where: { id, company_id },
        data,
      });
    }
}
