import { FastifyRequest, FastifyReply } from "fastify";
import { deleteSupplierService } from "@/services/supplier/deleteSupplier.js";

export async function deleteSupplier(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = Number(request.user.sub);
  const id = Number(request.params.id);

  try {
    await deleteSupplierService(id, company_id);
    return reply.status(200).send({ message: "Fornecedor deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar fornecedor:", error);
    return reply.status(500).send({ message: "Erro interno ao deletar" });
  }
}