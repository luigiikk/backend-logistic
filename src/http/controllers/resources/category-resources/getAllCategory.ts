import { getAllCategoryService } from "@/services/resources/category/getAllCategory.js";
import { getAllResourceService } from "@/services/resources/getAllResource.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllCategory(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {
    const categories = await getAllCategoryService();

    return reply.status(200).send(categories);
  } catch (error) {
    return reply.status(500).send({
      error: "Could not fetch categories."
    });
  }
}