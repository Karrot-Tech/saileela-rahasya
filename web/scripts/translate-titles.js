/**
 * Translate Hindi Titles to English
 * 
 * This script translates Hindi titles in leela_articles.json to English
 * using the Gemini API.
 * 
 * Usage: node scripts/translate-titles.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:3000/api/agent/generate-leela';
const ARTICLES_PATH = path.join(__dirname, '../src/data/leela_articles.json');

// Rate limiting: delay between API calls (ms)
const DELAY_BETWEEN_CALLS = 2000;

// Regex to detect Hindi characters
const HINDI_REGEX = /[\u0900-\u097F]/;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateTitle(hindiTitle) {
    console.log(`   🔄 Translating: "${hindiTitle.substring(0, 50)}..."`);

    try {
        // Use the same API but with a minimal transcript to just get title translation
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                youtube_id: 'translate-only',
                title: hindiTitle,
                // Provide a minimal transcript that triggers title translation only
                transcript: `Title translation request: ${hindiTitle}. Please provide only an English title for this spiritual discourse about Sai Baba.`
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(`   ❌ Error: ${error.error}`);
            return null;
        }

        const content = await response.json();

        // The API returns suggested_title in English
        if (content.suggested_title && !HINDI_REGEX.test(content.suggested_title)) {
            console.log(`   ✅ Translated: "${content.suggested_title.substring(0, 50)}..."`);
            return content.suggested_title;
        } else if (content.rejected) {
            // If rejected, let's try a direct translation approach
            console.log(`   ⚠️ Content rejected, keeping original title`);
            return null;
        }

        return null;
    } catch (error) {
        console.error(`   ❌ Network error: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('🌐 Hindi Title Translator');
    console.log('='.repeat(60));

    // Load articles
    console.log('\n📂 Loading articles...');
    if (!fs.existsSync(ARTICLES_PATH)) {
        console.error('❌ Articles file not found:', ARTICLES_PATH);
        process.exit(1);
    }

    const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf-8'));
    console.log(`   Found ${articles.length} articles`);

    // Find articles with Hindi titles
    const hindiTitleArticles = articles.filter(a => HINDI_REGEX.test(a.title_english));
    console.log(`   Found ${hindiTitleArticles.length} articles with Hindi titles`);

    if (hindiTitleArticles.length === 0) {
        console.log('\n✨ All titles are already in English!');
        return;
    }

    let translatedCount = 0;

    // Process each article with Hindi title
    for (let i = 0; i < hindiTitleArticles.length; i++) {
        const article = hindiTitleArticles[i];
        console.log(`\n[${i + 1}/${hindiTitleArticles.length}] Article ID ${article.id}:`);

        const translatedTitle = await translateTitle(article.title_english);

        if (translatedTitle) {
            // Update the article in the original array
            const originalIndex = articles.findIndex(a => a.id === article.id);
            if (originalIndex !== -1) {
                articles[originalIndex].title_english = translatedTitle;
                translatedCount++;

                // Save after each translation
                fs.writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2), 'utf-8');
                console.log(`   💾 Saved progress`);
            }
        }

        // Rate limiting
        if (i < hindiTitleArticles.length - 1) {
            console.log(`   ⏱️ Waiting ${DELAY_BETWEEN_CALLS / 1000}s...`);
            await sleep(DELAY_BETWEEN_CALLS);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✨ Translation complete! Translated ${translatedCount}/${hindiTitleArticles.length} titles.`);
    console.log('='.repeat(60));
}

main().catch(console.error);
