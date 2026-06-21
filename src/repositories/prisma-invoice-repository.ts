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

    return invoices.map((inv) => ({
      ...inv,
      purchase_order: {
        ...inv.purchase_order,
        code: `PC-${String(inv.purchase_order.id).padStart(5, "0")}`,
      },
    }));
  }

  async getInvoice(id: number, company_id: number) {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        company_id,
      },
      include: {
        purchase_order: {
          include: {
            status: true,
          },
        },
      },
    });

    if (!invoice) return null;
    return {
      ...invoice,
      purchase_order: {
        ...invoice.purchase_order,
        code: `PC-${String(invoice.purchase_order.id).padStart(5, "0")}`,
      },
    };
  }

  async deleteInvoice(id: number) {
    return await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id },
      });

      if (!invoice) throw new Error("Invoice not found");

      const { purchase_order_id, company_id } = invoice;

      const order = await tx.purchase_orders.findUnique({
        where: { id: purchase_order_id, company_id },
        include: { items: true },
      });

      if (order) {
        for (const item of order.items) {
          const inventory = await tx.inventory.findFirst({
            where: { resource_id: item.resource_id, warehouse_id: item.warehouse_id, company_id },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { id: inventory.id },
              data: { quantity: { decrement: item.quantity ?? 0 } },
            });
          }
        }

        await tx.purchase_order_items.deleteMany({ where: { purchase_order_id, company_id } });
      }

      await tx.invoice.delete({ where: { id } });

      if (order) {
        await tx.purchase_orders.delete({ where: { id: purchase_order_id } });
      }
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