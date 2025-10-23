import { FastifyRequest, FastifyReply } from "fastify";
import { getProductService } from "@/services/products/getProduct.js";

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

  try {
    const product = await getProductService(id);
    return reply.status(200).send(product);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
