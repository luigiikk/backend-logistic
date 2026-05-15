interface VolumetricItem {
  height: number;
  width: number;
  depth: number;
  quantity?: number | null;
}

export function calculateItemsVolume(items: VolumetricItem[]): number {
  return items.reduce((acc, item) => {
    const unitVolume = item.height * item.width * item.depth;
    return acc + (unitVolume * (item.quantity ?? 1));
  }, 0);
}