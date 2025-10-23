import { FastifyRequest, FastifyReply } from "fastify";
import { getAllStatusService } from "@/services/status/getAllStatus.js";

export async function getAllStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const status = await getAllStatusService();
    return reply.status(200).send(status);
  } catch (error) {
    console.error("Error searching for status:", error);
    return reply
      .status(500)
      .send({ message: "Internal Server Error", details: error });
  }
}
