import { FastifyRequest, FastifyReply } from "fastify";
import { getStatusService } from "@/services/status/getStatus.js";

export async function getStatus(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

  try {
      await request.jwtVerify();
  
      if (request.user.role != "company") {
        return reply.status(409).send();
      }
  
      const company_id = request.user.sub;
  
      const status = await getStatusService(id, company_id);
  
  
      const response = {
        name: status.name,
        type: status.type,
        is_default: status.is_default,
      };
    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
