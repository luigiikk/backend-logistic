import { prisma } from "@/lib/prisma.js";

export async function getOrderTrackingService(orderCodeOrId: string) {
  const isId = !isNaN(Number(orderCodeOrId));

  const order = await prisma.orders.findFirst({
    where: isId ? { id: Number(orderCodeOrId) } : { code: orderCodeOrId },
    select: {
      id: true,
      code: true,
      estimated_delivery: true, 
      created_at: true,
      status: {
        select: {
          name: true,
          type: true
        }
      },
      tracking_history: {
        orderBy: { created_at: 'desc' },
        select: {
          created_at: true,
          description: true,
          status: {
            select: { name: true }
          }
        }
      }
    }
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  return order;
}