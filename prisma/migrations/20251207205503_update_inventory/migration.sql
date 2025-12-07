/*
  Warnings:

  - A unique constraint covering the columns `[resource_id,warehouse_id,company_id]` on the table `inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "inventory_resource_id_warehouse_id_company_id_key" ON "public"."inventory"("resource_id", "warehouse_id", "company_id");
