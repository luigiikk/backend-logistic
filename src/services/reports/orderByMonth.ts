import { PrismaReportsRepository } from "@/repositories/prisma-reports-repository.js";
 
interface OrdersByMonthParams {
  company_id: number;
  year: number;
  month: number;
}
 
export async function getOrdersByMonthService({
  company_id,
  year,
  month,
}: OrdersByMonthParams) {
  const repository = new PrismaReportsRepository();
 
  return repository.getOrdersByMonth(company_id, year, month);
}