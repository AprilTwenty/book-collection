import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
  }
  prisma = global.prisma;
}

export default prisma;
