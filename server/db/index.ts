import { PrismaClient } from "@prisma/client";

// ensure that we only instantiate Prisma once
export const prisma = new PrismaClient();
