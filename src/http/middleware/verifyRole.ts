import type { FastifyReply, FastifyRequest } from "fastify";

export function verifyRole(allowedRoles: string[]) {
  return async <T extends FastifyRequest>(
    request: T,
    reply: FastifyReply
  ) => {
    try {
      await request.jwtVerify();

      const user = request.user;

      if (!allowedRoles.includes(user.role)) {
        return reply.status(403).send({ message: "Access denied." });
      }
    } catch (err) {
      return reply.status(401).send({ message: "Unauthorized." });
    }
  };
}
