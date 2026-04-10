import { PrismaClient } from '@prisma/client';

let instance: PrismaClient | null = null;

export function getClient(): PrismaClient {
  if (!instance) {
    instance = new PrismaClient();
  }
  return instance;
}

export async function disconnectClient(): Promise<void> {
  if (instance) {
    await instance.$disconnect();
    instance = null;
  }
}
