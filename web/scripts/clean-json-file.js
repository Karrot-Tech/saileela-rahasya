const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../src/data/leela_articles.json');

try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const articles = JSON.parse(rawData);
    console.log(`Read ${articles.length} articles from JSON.`);

    let updatedCount = 0;

    const cleanedArticles = articles.map(article => {
        let needsUpdate = false;
        let newDoubt = article.doubt;
        let newRev = article.revelation;
        // We are keeping scriptural_refs as is, based on user preference for 📖

        // Clean doubt
        if (newDoubt) {
            const cleaned = newDoubt
                .replace(/^(❓|\?)\s*\*\*Doubt\*\*:?\s*/i, '')
                .replace(/^(❓|\?)\s*\*\*Doubt\*\*\s+/i, '');

            if (cleaned !== newDoubt) {
                newDoubt = cleaned;
                needsUpdate = true;
            }
        }

        // Clean revelation
        if (newRev) {
            const cleaned = newRev
                .replace(/^(💡)\s*\*\*Revelation\*\*:?\s*/i, '')
                .replace(/^(💡)\s*\*\*Revelation\*\*\s+/i, '');

            if (cleaned !== newRev) {
                newRev = cleaned;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            updatedCount++;
        }

        return {
            ...article,
            doubt: newDoubt,
            revelation: newRev
        };
    });

    if (updatedCount > 0) {
        fs.writeFileSync(jsonPath, JSON.stringify(cleanedArticles, null, 2));
        console.log(`Successfully cleaned ${updatedCount} articles in JSON file.`);
    } else {
        console.log('No articles needed cleaning in JSON file.');
    }

} catch (error) {
    console.error('Error cleaning JSON file:', error);
}
