import { FastifyRequest, FastifyReply } from "fastify";
import { getOrderTrackingHistoryByOrderIdService } from "@/services/order/tracking/getOrderTrackingHistoryByOrderIdService.js";
import { getPublicTrackingService } from "@/services/order/tracking/getPublicTrackingService.js";

export async function getPublicTracking(
  request: FastifyRequest<{ Querystring: { code: string, cpf: string, } }>,
  reply: FastifyReply
) {

  const { code, cpf } = request.query;
  try {
    const order =
      await getPublicTrackingService({
        code,
        cpf,
      });

    return reply.status(200).send({
      order: {
        id: order.id,
        code: order.code,

        status: {
          id: order.status.id,
          name: order.status.name,
        },
      },

      tracking: order.tracking,
    });
  } catch (error) {
    return reply.status(404).send({
      message:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}
