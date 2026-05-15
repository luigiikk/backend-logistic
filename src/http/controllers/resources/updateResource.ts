import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateResourceService } from "@/services/resources/updateResource.js";

export const updateResourceBodySchema = z.object({
  name: z.string(),
  category_id: z.number(),
  height: z.coerce.number().positive(),
  width: z.coerce.number().positive(),
  length: z.coerce.number().positive(),
});

type RegisterBody = z.infer<typeof updateResourceBodySchema>;

export async function updateResource(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    name,
    height,
    width,
    length,
    category_id
  } = request.body;

  const { id } = request.params;

  await request.jwtVerify();
    const company_id = request.user.sub;

    if (request.user.role != "company") {
      return reply.status(409).send();
    }
    

  try {
    await updateResourceService(id, company_id, {
      name,
      height,
      width,
      length,
      category_id
    } );
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Resource updated successfully" });
}
