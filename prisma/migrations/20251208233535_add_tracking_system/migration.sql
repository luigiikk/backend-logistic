-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "estimated_delivery" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."order_tracking" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_tracking_order_id_idx" ON "public"."order_tracking"("order_id");

-- AddForeignKey
ALTER TABLE "public"."order_tracking" ADD CONSTRAINT "order_tracking_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_tracking" ADD CONSTRAINT "order_tracking_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
