import { FastifyRequest, FastifyReply } from "fastify";
import { getAllCompaniesService } from "@/services/getAllCompanies.js";


export async function getAllCompanies(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {
    const companies = await getAllCompaniesService();
    return reply.status(200).send(companies);
  } catch (error) {
    return reply.status(409).send();
  }  
}
