import { PrismaReportsRepository } from "@/repositories/prisma-reports-repository.js";

interface OrdersByPeriodParams {
  company_id: number;
  start_date: string;
  end_date: string;
}
 
export async function getOrdersByPeriodService({
  company_id,
  start_date,
  end_date,
}: OrdersByPeriodParams) {
  const repository = new PrismaReportsRepository();
 
  return repository.getOrdersByPeriod(
    company_id,
    new Date(start_date),
    new Date(end_date)
  );
}