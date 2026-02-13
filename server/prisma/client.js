import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config(); // โหลด env ให้แน่ใจ

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  }
  prisma = global.prisma;
}

export default prisma;
