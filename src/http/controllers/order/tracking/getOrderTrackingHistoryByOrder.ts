import { FastifyRequest, FastifyReply } from "fastify";
import { getOrderTrackingHistoryByOrderIdService } from "@/services/order/tracking/getOrderTrackingHistoryByOrderIdService.js";

export async function getOrderTrackingHistoryByOrderId(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { id: order_id } = request.params as { id: number };
  try {
    await request.jwtVerify();

    const company_id = Number(request.user.sub);

    const orderWithTrackingHistory =
      await getOrderTrackingHistoryByOrderIdService({
        order_id,
        company_id,
      });

      const response = {
        order: {
          id: orderWithTrackingHistory.id,
          code: orderWithTrackingHistory.code,
          status: orderWithTrackingHistory.status.name,
        },
      
        tracking: orderWithTrackingHistory.tracking.map((item) => ({
          id: item.id,
          location: item.location,
          description: item.description,
      
          estimated_delivery: item.estimated_delivery
            ? item.estimated_delivery.toISOString()
            : null,
      
          occurred_at: item.occurred_at.toISOString(),
      
          status: item.status,
        })),
      };

    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send({
      message:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}
