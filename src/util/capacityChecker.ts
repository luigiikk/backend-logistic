import { Prisma } from "@prisma/client";

type PrismaTransaction = Omit<
  Prisma.TransactionClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

// ─── checkCapacity ────────────────────────────────────────────────────────────

interface CheckCapacityParams {
  tx: PrismaTransaction;
  type: "vehicle" | "warehouse";
  id: number;
  incomingVolume: number;
  /**
   * Em updates, passar o ID do pedido/purchase_order sendo editado para
   * excluí-lo do cálculo de volume já ocupado — evita falso estouro.
   */
  excludeOrderId?: number;
}

export async function checkCapacity({
  tx,
  type,
  id,
  incomingVolume,
  excludeOrderId,
}: CheckCapacityParams): Promise<void> {
  if (type === "vehicle") {
    const vehicle = await tx.vehicles.findUnique({
      where: { id },
      select: { total_volume: true },
    });

    if (!vehicle) throw new Error("Vehicle not found");

    const used = await tx.products.aggregate({
      _sum: { volume: true },
      where: {
        order: {
          vehicle_id: id,
          ...(excludeOrderId ? { id: { not: excludeOrderId } } : {}),
        },
      },
    });

    const currentVolume = used._sum.volume ?? 0;
    const available = vehicle.total_volume - currentVolume;

    if (currentVolume + incomingVolume > vehicle.total_volume) {
      throw new Error(
        `Vehicle capacity exceeded. Available: ${available.toFixed(3)} m³, requested: ${incomingVolume.toFixed(3)} m³`
      );
    }
  }

  if (type === "warehouse") {
    const warehouse = await tx.warehouses.findUnique({
      where: { id },
      select: { total_volume: true, name: true },
    });

    if (!warehouse) throw new Error("Warehouse not found");

    const used = await tx.purchase_order_items.aggregate({
      _sum: { volume: true },
      where: {
        warehouse_id: id,
        ...(excludeOrderId ? { purchase_order_id: { not: excludeOrderId } } : {}),
      },
    });

    const currentVolume = used._sum.volume ?? 0;
    const available = warehouse.total_volume - currentVolume;

    if (currentVolume + incomingVolume > warehouse.total_volume) {
      throw new Error(
        `Warehouse "${warehouse.name}" capacity exceeded. Available: ${available.toFixed(3)} m³, requested: ${incomingVolume.toFixed(3)} m³`
      );
    }
  }
}

// ─── calcIncomingVolume ───────────────────────────────────────────────────────

interface ResourceItem {
  resource_id: number;
  warehouse_id: number;
  quantity: number;
}

/**
 * Calcula o volume total de um conjunto de itens de purchase order,
 * agrupado por warehouse_id.
 *
 * Retorna um Map<warehouse_id, volumeTotal> para que o repositório
 * possa chamar checkCapacity uma vez por warehouse.
 *
 * O volume de cada item = resource.width * resource.height * resource.length * quantity
 * Se o resource não tiver dimensões definidas, contribui com 0.
 */
export async function calcIncomingVolumeByWarehouse(
  tx: PrismaTransaction,
  items: ResourceItem[]
): Promise<Map<number, number>> {
  const volumeByWarehouse = new Map<number, number>();

  for (const item of items) {
    const resource = await tx.resources.findUnique({
      where: { id: item.resource_id },
      select: { width: true, height: true, length: true },
    });

    const unitVolume =
      resource?.width && resource?.height && resource?.length
        ? resource.width * resource.height * resource.length
        : 0;

    const itemVolume = unitVolume * item.quantity;

    volumeByWarehouse.set(
      item.warehouse_id,
      (volumeByWarehouse.get(item.warehouse_id) ?? 0) + itemVolume
    );
  }

  return volumeByWarehouse;
}