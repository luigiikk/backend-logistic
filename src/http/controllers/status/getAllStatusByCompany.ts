import { FastifyRequest, FastifyReply } from "fastify";
import { getAllStatusByCompanyService } from "@/services/status/getAllStatusByCompany.js";

export async function getAllStatusByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const company_id = request.user.sub;

    if(request.user.role != "company"){
      return reply.status(409).send();
    }

    const status = await getAllStatusByCompanyService(company_id);
    const formattedStatuses = status.map((status) => ({
      name: status.name ?? "",
      type: status.type ?? "",
      is_default: status.is_default ?? false,
    }));

    return reply.status(200).send(formattedStatuses);
  } catch (error) {
    console.error("Error searching for status:", error);
    return reply
      .status(500)
      .send({ message: "Internal Server Error", details: error });
  }
}
