import { FastifyRequest, FastifyReply } from "fastify";
import { getAllStatusByCompanyService } from "@/services/status/getAllStatusByCompany.js";

export async function getAllStatusByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const status = await getAllStatusByCompanyService();
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
