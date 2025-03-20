async function analyzeBook(bookTitle) {
    const API_KEY = 'YOUR_GEMINI_API_KEY';
    const response = await fetch(`https://api.gemini.ai/analyze?title=${encodeURIComponent(bookTitle)}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    return await response.json();
}
