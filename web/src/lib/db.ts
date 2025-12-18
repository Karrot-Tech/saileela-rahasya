import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
    var prismaGlobalV10: undefined | any
}

const prismaClientSingleton = () => {
    // Priority: POSTGRES_PRISMA_URL (Neon/Vercel standard) -> DATABASE_URL
    const connectionString = (
        process.env.POSTGRES_PRISMA_URL ||
        process.env.DATABASE_URL ||
        process.env.DATABASE_URL_UNPOOLED ||
        ''
    ).trim().replace(/^"(.*)"$/, '$1');

    if (!connectionString) {
        throw new Error('DATABASE_URL is missing');
    }

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    return new PrismaClient({ adapter })
}

const prisma = globalThis.prismaGlobalV10 ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobalV10 = prisma
