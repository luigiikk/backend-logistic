/*
  Warnings:

  - You are about to drop the column `client_roles` on the `client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."client" DROP CONSTRAINT "client_client_roles_fkey";

-- DropIndex
DROP INDEX "public"."client_client_roles_idx";

-- AlterTable
ALTER TABLE "public"."client" DROP COLUMN "client_roles";
