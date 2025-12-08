/*
  Warnings:

  - Added the required column `inventory_id` to the `purchase_order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouse_id` to the `purchase_order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."purchase_order_items" ADD COLUMN     "inventory_id" INTEGER NOT NULL,
ADD COLUMN     "warehouse_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."purchase_order_items" ADD CONSTRAINT "purchase_order_items_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_order_items" ADD CONSTRAINT "purchase_order_items_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
