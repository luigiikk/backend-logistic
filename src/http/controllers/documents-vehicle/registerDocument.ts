import { createVehicleDocumentService } from "@/services/documents-vehicle/registerDocument.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

const vehicleDocumentBodySchema = z.object({
  type: z.string(),
  number: z.string().optional(),
  issued_at: z.string().optional(),   
  expires_at: z.string().optional(),  
  file_url: z.string().optional(),    
  notes: z.string().optional(),
});
 
export { vehicleDocumentBodySchema };
 
type DocumentBody = z.infer<typeof vehicleDocumentBodySchema>;
 
export async function createVehicleDocument(
  request: FastifyRequest<{
    Params: { vehicle_id: number };
    Body: DocumentBody;
  }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;
  const { vehicle_id } = request.params;
  const { type, number, issued_at, expires_at, file_url, notes } =
    request.body;
 
  try {
    const document = await createVehicleDocumentService({
      vehicle_id,
      company_id,
      type,
      number,
      issued_at,
      expires_at,
      file_url,
      notes,
    });
 
    return reply.status(201).send(document);
  } catch (error) {
    return reply.status(409).send(error);
  }
}