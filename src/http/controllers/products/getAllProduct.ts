import { FastifyRequest, FastifyReply } from "fastify";
import { getAllProductsService } from "@/services/products/getAllProduct.js";


export async function getAllProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const products = await getAllProductsService();
    return reply.status(200).send(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return reply.status(500).send({ message: "Internal Server Error", details: error });
  }  
}

