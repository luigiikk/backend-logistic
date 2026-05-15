interface VolumetricItem {
  height: number;
  width: number;
  length: number;
  quantity?: number | null;
}

export function calculateItemsVolume(items: VolumetricItem[]): number {
  return items.reduce((acc, item) => {
    const unitVolume = item.height * item.width * item.length;
    return acc + (unitVolume * (item.quantity ?? 1));
  }, 0);
}