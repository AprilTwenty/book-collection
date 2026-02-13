import { PrismaClient } from "@prisma/client";

let prisma;

console.log("ENV:", process.env.NODE_ENV);
console.log("DB URL exists:", !!process.env.DATABASE_URL);

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
