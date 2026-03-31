import { PrismaClient } from '@prisma/client';

// PrismaClient con configuración para Prisma 7
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});

export default prisma;
