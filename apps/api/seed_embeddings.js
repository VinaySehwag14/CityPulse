require('dotenv').config();
const { Pool } = require('pg');
const { GoogleGenAI } = require('@google/genai');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function backfill() {
    try {
        const result = await pool.query('SELECT id, title, description FROM events WHERE embedding IS NULL');
        console.log(`Found ${result.rows.length} events missing embeddings.`);

        for (const event of result.rows) {
            console.log(`Processing event: ${event.title}`);
            const text = `${event.title}. ${event.description || ''}`;

            const response = await ai.models.embedContent({
                model: 'gemini-embedding-001',
                contents: text,
            });

            const embedding = response.embeddings?.[0]?.values;
            if (embedding) {
                await pool.query('UPDATE events SET embedding = $1 WHERE id = $2', [JSON.stringify(embedding), event.id]);
                console.log(`Successfully updated embedding for: ${event.id}`);
            } else {
                console.warn(`Failed to generate embedding for: ${event.id}`);
            }

            // Delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('Backfill complete.');
    } catch (err) {
        console.error('Backfill failed:', err);
    } finally {
        pool.end();
    }
}

backfill();
