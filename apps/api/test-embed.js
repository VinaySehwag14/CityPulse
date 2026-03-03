require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.embedContent({ model: 'text-embedding-004', contents: 'hello world' });
    console.log("Embeddings Array?:", !!res.embeddings);
    console.log("Embeddings values length:", res.embeddings[0].values.length);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
