import { getResourceByIdService } from "@/services/resources/getResourceById.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getResourceById(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { id } = request.params as { id: number };

  await request.jwtVerify();

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const company_id = request.user.sub;

  try {
    const resource = await getResourceByIdService(company_id, id);

    return reply.status(200).send(resource);
  } catch (error) {
    console.log(error);
    return reply
      .status(409)
      .send({ error: "Could not found resources." });
  }
}