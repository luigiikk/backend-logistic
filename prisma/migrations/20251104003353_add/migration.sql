/*
  Warnings:

  - You are about to drop the column `receiver_client_id` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_receiver_client_id_fkey";

-- DropIndex
DROP INDEX "public"."orders_receiver_client_id_idx";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "receiver_client_id",
ADD COLUMN     "code" TEXT,
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "recipient_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Recipient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_cpf_key" ON "public"."Recipient"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_email_key" ON "public"."Recipient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_code_key" ON "public"."orders"("code");

-- CreateIndex
CREATE INDEX "orders_recipient_id_idx" ON "public"."orders"("recipient_id");

-- CreateIndex
CREATE INDEX "orders_company_id_idx" ON "public"."orders"("company_id");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."Recipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
