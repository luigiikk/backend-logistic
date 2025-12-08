import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerStatusService } from "@/services/status/registerStatus.js";

export const statusRegisterBodySchema = z.object({
  name: z.string(),
  type: z.enum(["order", "vehicle", "invoice", "purchase_order"]),
  is_default: z.boolean().optional(),
});

type RegisterBody = z.infer<typeof statusRegisterBodySchema>;

export async function registerStatus(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, type, is_default } = request.body;

  await request.jwtVerify();
  const user = request.user;
  const company_id = user.sub

  try {
    await registerStatusService({
      name,
      type,
      is_default: is_default ?? false,
      company_id,
    });
  } catch (error) {
    return reply.status(409).send();
  }
  return reply.status(201).send();
}
