import { getAllCategoryService } from "@/services/resources/category/getAllCategory.js";
import { getAllResourceService } from "@/services/resources/getAllResource.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllCategory(
  request: FastifyRequest,
  reply: FastifyReply
) {

  await request.jwtVerify();

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const company_id = request.user.sub;

  try {
    const category = await getAllCategoryService(company_id);

    return reply.status(200).send(category);
  } catch (error) {
    console.log(error);
    return reply
      .status(409)
      .send({ error: "Could not found resources." });
  }
}