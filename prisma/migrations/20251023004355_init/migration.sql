/*
  Warnings:

  - You are about to drop the column `user_id` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `employee_id` to the `user_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."user_roles" DROP CONSTRAINT "user_roles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."vehicles" DROP CONSTRAINT "vehicles_user_id_fkey";

-- DropIndex
DROP INDEX "public"."user_roles_user_id_idx";

-- AlterTable
ALTER TABLE "public"."user_roles" DROP COLUMN "user_id",
ADD COLUMN     "employee_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."vehicles" DROP COLUMN "user_id",
ADD COLUMN     "company_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "CNPJ" TEXT,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employees" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "enrollment" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "public"."companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_CNPJ_key" ON "public"."companies"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "employees_enrollment_key" ON "public"."employees"("enrollment");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "public"."employees"("email");

-- CreateIndex
CREATE INDEX "user_roles_employee_id_idx" ON "public"."user_roles"("employee_id");

-- CreateIndex
CREATE INDEX "vehicles_status_id_idx" ON "public"."vehicles"("status_id");

-- CreateIndex
CREATE INDEX "vehicles_company_id_idx" ON "public"."vehicles"("company_id");

-- AddForeignKey
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
