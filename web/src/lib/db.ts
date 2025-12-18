import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
    var prismaGlobalV9: undefined | any
}

const prismaClientSingleton = () => {
    // For pg adapter, use the pooled URL (DATABASE_URL)
    const connectionString = (process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || '').trim().replace(/^"(.*)"$/, '$1');

    console.log('--- Prisma Singleton (V9): Using pg adapter ---');
    console.log('URL Prefix:', connectionString ? connectionString.substring(0, 15) + '...' : 'NONE');

    if (!connectionString) {
        throw new Error('DATABASE_URL is missing');
    }

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    return new PrismaClient({ adapter })
}

const prisma = globalThis.prismaGlobalV9 ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobalV9 = prisma
