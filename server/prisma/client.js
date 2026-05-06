import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// โหลด .env ก่อนสร้าง Pool — รองรับทั้ง server/.env และโฟลเดอร์โปรเจกต์ด้านบน (cwd ตอนรันมักเป็น server/)
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error(
        "[prisma] DATABASE_URL ไม่ถูกตั้ง — ใส่ใน server/.env หรือ .env ที่ root โปรเจกต์"
    );
}

const pool = new pg.Pool({
    connectionString
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
