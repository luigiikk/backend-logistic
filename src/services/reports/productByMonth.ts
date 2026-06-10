import { PrismaReportsRepository } from "@/repositories/prisma-reports-repository.js";

interface ProductsByMonthParams {
  company_id: number;
  year: number;
  month: number;
}
 
export async function getProductsByMonthService({
  company_id,
  year,
  month,
}: ProductsByMonthParams) {
  const repository = new PrismaReportsRepository();
 
  return repository.getProductsByMonth(company_id, year, month);
}