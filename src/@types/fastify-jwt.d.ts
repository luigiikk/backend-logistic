import "@fastify/jwt"

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    payload: { sub: number } 
    user: {
      sub: number,
    } 
  }
}