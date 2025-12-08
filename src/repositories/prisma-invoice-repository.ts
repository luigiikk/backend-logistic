import { prisma } from "@/lib/prisma.js";
import { InvoiceUpdateParams } from "@/services/invoice/updateInvoice.js";
import { Prisma } from "@prisma/client";

export class PrismaInvoicesRepository {
  
  async create(data: Prisma.InvoiceUncheckedCreateInput) {
    const invoice = await prisma.invoice.create({
      data,
    });

    return invoice;
  }

  async getAllInvoices(company_id: number) {
    const invoices = await prisma.invoice.findMany({
      where: {
        company_id,
      },
      include: {
        purchase_order: {
          include: {
            supplier: true,
            status: true,
          },
        },
      },
    });

    return invoices;
  }

  async getInvoice(id: number, company_id: number) {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        company_id,
      },
      include: {
        purchase_order: true,
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

  async updateInvoice(id: number, company_id: number, data: InvoiceUpdateParams) {
    const result = await prisma.invoice.updateMany({
      where: { 
        id, 
        company_id 
      },
      data,
    });
    return result; 
  }
}