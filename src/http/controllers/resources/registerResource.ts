import { registerResourceService } from "@/services/resources/registerResource.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const resourceRegisterBodySchema = z.object({
  name: z.string(),
  description:  z.string(),
  height: z.coerce.number().positive(),
  width: z.coerce.number().positive(),
  depth: z.coerce.number().positive(),
  category_id: z.number(),
});

type RegisterBody = z.infer<typeof resourceRegisterBodySchema>;

export async function resourceRegister(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, description, height, width, depth, category_id } = request.body;

  await request.jwtVerify();

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const company_id = request.user.sub;

  try {
    await registerResourceService(company_id, { name, description, height, width, depth, category_id});
  } catch (error) {
    console.log(error)
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
