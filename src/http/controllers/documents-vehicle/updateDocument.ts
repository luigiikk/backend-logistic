import { updateVehicleDocumentService } from "@/services/documents-vehicle/updateDocument.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const vehicleDocumentUpdateBodySchema = z.object({
  type: z.string().optional(),
  number: z.string().optional(),
  issued_at: z.string().optional(),  
  expires_at: z.string().optional(),
  file_url: z.string().optional(),
  notes: z.string().optional(),
});

type UpdateDocumentBody = z.infer<typeof vehicleDocumentUpdateBodySchema>;

export async function updateVehicleDocument(
  request: FastifyRequest<{
    Params: { vehicle_id: number; id: number };
    Body: UpdateDocumentBody;
  }>,
  reply: FastifyReply
) {
  const { type, number, issued_at, expires_at, file_url, notes } = request.body;
  const { vehicle_id, id } = request.params;

  await request.jwtVerify();
  const company_id = request.user.sub;

  try {
  const updated = await updateVehicleDocumentService(id, vehicle_id, company_id, {
    type,
    number,
    issued_at: issued_at ? new Date(issued_at) : undefined,
    expires_at: expires_at ? new Date(expires_at) : undefined,
    file_url,
    notes,
  });

  return reply.status(200).send(updated);
} catch (error) {
  return reply.status(409).send(error);
}
}