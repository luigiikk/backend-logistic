import z from "zod";


export const ClientSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),

  CPF: z.string().nullable().optional(),
  CNPJ: z.string().nullable().optional(),

  street: z.string().nullable().optional(),
  number: z.number().nullable().optional(),
  complement: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  zipcode: z.string().nullable().optional(),
});

export type Client = z.infer<typeof ClientSchema>