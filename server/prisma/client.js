import { PrismaClient } from "@prisma/client";

let prisma;

const options = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

console.log("ENV:", process.env.NODE_ENV);
console.log("DB URL exists:", !!process.env.DATABASE_URL);

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(options);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(options);
  }
  prisma = global.prisma;
}

export default prisma;
