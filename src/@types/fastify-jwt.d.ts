import "@fastify/jwt"

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    payload: {
      sub: number;
      role: string;
    };
    user: {
      sub: number;
      role: string;
    };
  }
}