import { prisma } from "@/lib/prisma.js";

export async function generateTrackingCode(): Promise<string> {
  let trackingCode = "";
  let exists = true;

  while (exists) {
    const letters1 = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                    String.fromCharCode(65 + Math.floor(Math.random() * 26));

    const numbers = Math.floor(100_000_000 + Math.random() * 900_000_000).toString();
    
    const letters2 = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                    String.fromCharCode(65 + Math.floor(Math.random() * 26));
    
    trackingCode = `${letters1}${numbers}${letters2}`;

    const found = await prisma.orders.findFirst({ 
      where: { code: trackingCode } 
    });
    exists = found !== null;
  }

  return trackingCode;
}