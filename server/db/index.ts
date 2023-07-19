import { PrismaClient } from "@prisma/client";

// ensure that we only instantiate Prisma once
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DB_CONNECTION_STRING,
    },
  },
});
