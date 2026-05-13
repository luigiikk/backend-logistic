import { getCategoryByIdService } from "@/services/resources/category/getCategoryById.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getCategoryById(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { id } = request.params as { id: number };

  try {
    const category = await getCategoryByIdService(id);

    return reply.status(200).send(category);
  } catch (error) {
    return reply.status(404).send({
      error: "Category not found."
    });
  }
}