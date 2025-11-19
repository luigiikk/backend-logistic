-- AlterTable
ALTER TABLE "public"."Recipient" ADD COLUMN     "addres_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Recipient" ADD CONSTRAINT "Recipient_addres_id_fkey" FOREIGN KEY ("addres_id") REFERENCES "public"."addres"("id") ON DELETE SET NULL ON UPDATE CASCADE;
