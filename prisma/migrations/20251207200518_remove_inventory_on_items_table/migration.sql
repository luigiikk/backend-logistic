/*
  Warnings:

  - You are about to drop the column `inventory_id` on the `purchase_order_items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."purchase_order_items" DROP CONSTRAINT "purchase_order_items_inventory_id_fkey";

-- AlterTable
ALTER TABLE "public"."purchase_order_items" DROP COLUMN "inventory_id";
