// The single place the Prisma client is constructed — see
// reference/DATABASE_DECISIONS.md.
//
// Nothing outside services/ should import this. Business logic talks to the
// service interfaces in services/*, which own their queries; that boundary is
// what keeps Prisma swappable (CLAUDE.md, "Module boundaries").
import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/lib/generated/prisma/client"

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.local.example to .env.local and " +
        "start the local database (see reference/DATABASE_DECISIONS.md).",
    )
  }

  return new PrismaClient({
    // Prisma 7 has no built-in query engine — a driver adapter is required.
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  })
}

// Next.js hot-reloads server modules on every edit in development, which would
// otherwise build a new connection pool per reload until Postgres refuses more.
// The global survives reloads; production gets a plain module-scoped instance.
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
