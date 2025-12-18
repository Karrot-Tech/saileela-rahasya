import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: (() => {
      const url = process.env["POSTGRES_PRISMA_URL"] || process.env["DATABASE_URL"] || process.env["DATABASE_URL_UNPOOLED"];
      console.log('Prisma Config URL:', url ? url.substring(0, 30) + '...' : 'NONE');
      return url;
    })(),
  },
});
