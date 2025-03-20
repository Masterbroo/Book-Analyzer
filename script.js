async function analyzeBook(bookTitle) {
    const API_KEY = AIzaSyAPEAzj1YO2bZ7r5eB4aTibqnUSVlKpolE; // Move this to a secure server-side endpoint
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Analyze the book "${bookTitle}". Provide:
                        1. Page count (as number only)
                        2. Estimated reading time in hours (average speed)
                        3. Brief 50-word summary
                        4. Top 3 categories
                        Format as JSON: {"pageCount": number, "readingTime": number, "summary": string, "categories": string[]}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Extracting text response correctly
        if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
            throw new Error('Invalid API response structure');
        }

        // Ensure response is properly formatted JSON
        const responseText = data.candidates[0].content.parts[0].text.trim();
        return JSON.parse(responseText);

    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Failed to analyze book');
    }
}

async function processBook() {
    const bookTitle = document.getElementById('bookInput').value.trim();
    if (!bookTitle || bookTitle.length > 100) {
        alert('Please enter a valid book title (max 100 characters).');
        return;
    }

    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    try {
        loading.style.display = 'block';
        results.style.opacity = '0.5';

        const analysis = await analyzeBook(bookTitle);
        
        document.getElementById('pageCount').textContent = `${analysis.pageCount} pages`;
        document.getElementById('readingTime').textContent = 
            `${analysis.readingTime} hours (${Math.round(analysis.readingTime / 2)} days at 2hr/day)`;
        document.getElementById('summary').textContent = analysis.summary;
        document.getElementById('category').textContent = analysis.categories.join(' | ');

    } catch (error) {
        alert('Error analyzing book: ' + error.message);
    } finally {
        loading.style.display = 'none';
        results.style.opacity = '1';
    }
}

// Enter key handler
document.getElementById('bookInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processBook();
});
