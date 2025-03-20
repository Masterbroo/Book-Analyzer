async function analyzeBook(bookTitle) {
    const API_KEY = 'AIzaSyAPEAzj1YO2bZ7r5eB4aTibqnUSVlKpolE';
    const response = await fetch(`https://api.gemini.ai/analyze?title=${encodeURIComponent(bookTitle)}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    return await response.json();
}
