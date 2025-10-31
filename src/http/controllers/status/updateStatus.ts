import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateStatusService } from "@/services/status/updateStatus.js";

export const statusUpdateBodySchema = z.object({
  name: z.string(),
  type: z.enum(["order", "vehicle", "invoice", "purchase_order"]),
  is_default: z.boolean(),
  company_id: z.number().int(),
});

type RegisterBody = z.infer<typeof statusUpdateBodySchema>;

export async function updateStatus(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, type, is_default, company_id } =
    request.body;
  const { id } = request.params;

  try {
    await updateStatusService(id, {
      name,
      type,
      is_default,
      company_id,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Status updated successfully" });
}
