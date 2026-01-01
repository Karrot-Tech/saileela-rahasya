const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// 1. Load Environment Variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
console.log('Loading env from:', envPath);
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && trimmed.indexOf('=') !== -1 && !trimmed.startsWith('#')) {
            const parts = trimmed.split('=');
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1');
            process.env[key] = val;
        }
    });
}

// 2. Setup Prisma Client
const connectionString = (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    ''
).trim().replace(/^"(.*)"$/, '$1');

console.log('Using connection string length:', connectionString.length);

if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function cleanContent() {
    try {
        const leelas = await prisma.leela.findMany();
        console.log(`Found ${leelas.length} leelas.`);

        let updatedCount = 0;

        for (const leela of leelas) {
            let needsUpdate = false;
            const data = {};

            // clean doubt
            if (leela.doubt) {
                let newDoubt = leela.doubt
                    .replace(/^(❓|\?)\s*\*\*Doubt\*\*:?\s*/i, '')
                    .replace(/^(❓|\?)\s*\*\*Doubt\*\*\s+/i, '');

                if (newDoubt !== leela.doubt) {
                    data.doubt = newDoubt;
                    needsUpdate = true;
                }
            }

            // clean revelation
            if (leela.revelation) {
                let newRev = leela.revelation
                    .replace(/^(💡)\s*\*\*Revelation\*\*:?\s*/i, '')
                    .replace(/^(💡)\s*\*\*Revelation\*\*\s+/i, '');

                if (newRev !== leela.revelation) {
                    data.revelation = newRev;
                    needsUpdate = true;
                }
            }

            // Skipping scriptural_refs cleaning as requested (keeping 📖)

            if (needsUpdate) {
                console.log(`Cleaning Leela: ${leela.title_english}...`);
                await prisma.leela.update({
                    where: { id: leela.id },
                    data: data
                });
                updatedCount++;
            }
        }

        console.log(`\nFixed ${updatedCount} articles.`);

    } catch (error) {
        console.error('Error cleaning content:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanContent();
