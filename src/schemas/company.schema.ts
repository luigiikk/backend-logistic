import z from "zod";


export const CompanySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  cnpj: z.string(),
  street: z.string().nullable().optional(),
  number: z.number().nullable().optional(),
  complement: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  zipcode: z.string().nullable().optional(),
})

export type Company = z.infer<typeof CompanySchema>