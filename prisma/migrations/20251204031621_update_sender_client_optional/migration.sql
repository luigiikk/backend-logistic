-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_sender_client_id_fkey";

-- AlterTable
ALTER TABLE "public"."orders" ALTER COLUMN "sender_client_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_sender_client_id_fkey" FOREIGN KEY ("sender_client_id") REFERENCES "public"."client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
