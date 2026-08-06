// Prisma 7 config — see reference/DATABASE_DECISIONS.md
//
// Prisma does not auto-load env files, and this repo keeps its vars in
// .env.local (Next.js convention). Loading both, .env.local first, mirrors
// Next.js precedence.
import { config } from "dotenv"
import { defineConfig } from "prisma/config"

config({ path: [".env.local", ".env"] })

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
})
