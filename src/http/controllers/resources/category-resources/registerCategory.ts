import { registerCategoryService } from "@/services/resources/category/registerCategory.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const categoryRegisterBodySchema = z.object({
  name: z.string(),
  description: z.string(),
});

type RegisterBody = z.infer<typeof categoryRegisterBodySchema>;

export async function categoryRegister(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, description } = request.body;

  try {
    await registerCategoryService({ name, description});
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
