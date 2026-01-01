const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// 1. Load Environment Variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
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

// 2. Setup Prisma
const connectionString = (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    ''
).trim().replace(/^"(.*)"$/, '$1');

if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
    try {
        const jsonPath = path.resolve(__dirname, '../src/data/leela_articles.json');
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const articles = JSON.parse(rawData);

        console.log(`Read ${articles.length} articles from JSON.`);

        let created = 0;
        let updated = 0;

        for (const article of articles) {
            // Clean scriptural_refs to ensure it starts with book icon if present in JSON
            // (The user said they are okay with keeping 📖, and JSON likely has it)

            const existing = await prisma.leela.findFirst({
                where: {
                    title_english: article.title_english
                }
            });

            const payload = {
                orderId: typeof article.id === 'number' ? article.id : parseInt(article.id) || 0,
                title_english: article.title_english,
                transcript: article.transcript || '', // JSON might not have transcript, schema allows null?
                story: article.story,
                doubt: article.doubt,
                revelation: article.revelation,
                scriptural_refs: article.scriptural_refs,
                youtube_id: article.youtube_id,
                description: article.description,
                keywords: article.keywords || [],
                social_tags: article.social_tags || []
            };

            if (existing) {
                // Update
                await prisma.leela.update({
                    where: { id: existing.id },
                    data: payload
                });
                updated++;
                process.stdout.write('.');
            } else {
                // Create
                await prisma.leela.create({
                    data: payload
                });
                created++;
                process.stdout.write('+');
            }
        }

        console.log(`\n\nSeeding complete.`);
        console.log(`Created: ${created}`);
        console.log(`Updated: ${updated}`);

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
