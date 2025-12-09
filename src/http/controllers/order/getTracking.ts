import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { getOrderTrackingService } from "@/services/order/getTracking.js"; 

export async function getTracking(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    query: z.string(), 
  });

  
  const { query } = paramsSchema.parse(request.params);

  try {
    const trackingData = await getOrderTrackingService(query);
    
    return reply.status(200).send(trackingData);
  } catch (error) {
    return reply.status(404).send({ message: "Pedido não encontrado" });
  }
}