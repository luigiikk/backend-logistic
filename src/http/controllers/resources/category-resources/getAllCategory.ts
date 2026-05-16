import { getAllCategoryService } from "@/services/resources/category/getAllCategory.js";
import { getAllResourceService } from "@/services/resources/getAllResource.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllCategory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const categories = await getAllCategoryService();
  return reply.status(200).send(categories);
}