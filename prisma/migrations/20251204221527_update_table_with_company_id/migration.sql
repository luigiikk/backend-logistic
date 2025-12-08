/*
  Warnings:

  - Added the required column `company_id` to the `inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `purchase_order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `purchase_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `warehouses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."inventory" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."purchase_order_items" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."purchase_orders" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."resources" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."supplier" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."warehouses" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_order_items" ADD CONSTRAINT "purchase_order_items_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_orders" ADD CONSTRAINT "purchase_orders_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."supplier" ADD CONSTRAINT "supplier_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."warehouses" ADD CONSTRAINT "warehouses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
