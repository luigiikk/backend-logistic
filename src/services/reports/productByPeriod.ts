import { PrismaReportsRepository } from "@/repositories/prisma-reports-repository.js";

interface ProductsByPeriodParams {
  company_id: number;
  start_date: string;
  end_date: string;
}
 
export async function getProductsByPeriodService({
  company_id,
  start_date,
  end_date,
}: ProductsByPeriodParams) {
  const repository = new PrismaReportsRepository();
 
  return repository.getProductsByPeriod(
    company_id,
    new Date(start_date),
    new Date(end_date)
  );
}
