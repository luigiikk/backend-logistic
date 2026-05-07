import { FastifyRequest, FastifyReply } from "fastify";
import { deleteProductService } from "@/services/products/deleteProduct.js";

export async function deleteProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  try {
    await deleteProductService(id);
    return reply.status(200).send();
  } catch (error) {
    return reply.status(409).send(error);
  }
}
