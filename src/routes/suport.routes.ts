import type { FastifyTypedInstance } from "@/@types/types.js";
import { sendSupport } from "@/http/controllers/email/sendSupport.js";
import z from "zod";



export async function supportRoutes(app: FastifyTypedInstance) {
 
  app.post(
    "/support",
    {
      schema: {
        tags: ["email"],
        description: "send a email for support",
        body: z.object({
          email: z.string().email(),
          message: z.string().min(5),
          name: z.string().min(5),
          phone: z.string(),
          subject: z.string(),
        }),
      },
    },
    sendSupport
  );
}

