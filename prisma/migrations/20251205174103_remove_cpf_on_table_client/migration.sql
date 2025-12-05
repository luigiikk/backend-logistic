/*
  Warnings:

  - You are about to drop the column `CPF` on the `client` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."client_CPF_key";

-- AlterTable
ALTER TABLE "public"."client" DROP COLUMN "CPF";
