import { getAllResourceService } from "@/services/resources/getAllResource.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllResource(
  request: FastifyRequest,
  reply: FastifyReply
) {

  await request.jwtVerify();

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const company_id = request.user.sub;

  try {
    const resource = await getAllResourceService(company_id);

    return reply.status(200).send(resource);
  } catch (error) {
    console.log(error);
    return reply
      .status(409)
      .send({ error: "Could not found resources." });
  }
}