<script>
    async function analyzeBook(bookTitle) {
        const API_KEY = 'AIzaSyAPEAzj1YO2bZ7r5eB4aTibqnUSVlKpolE';
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
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
                            Format as JSON: {pageCount: number, readingTime: number, summary: string, categories: string[]}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const responseText = data.candidates[0].content.parts[0].text;
            return JSON.parse(responseText.match(/{.*}/s)[0]);

        } catch (error) {
            console.error('API Error:', error);
            throw new Error('Failed to analyze book');
        }
    }

    async function processBook() {
        const bookTitle = document.getElementById('bookInput').value.trim();
        if (!bookTitle) return;

        const loading = document.getElementById('loading');
        const results = document.getElementById('results');
        
        try {
            loading.style.display = 'block';
            results.style.opacity = '0.5';

            const analysis = await analyzeBook(bookTitle);
            
            document.getElementById('pageCount').textContent = `${analysis.pageCount} pages`;
            document.getElementById('readingTime').textContent = 
                `${analysis.readingTime} hours (${Math.round(analysis.readingTime/24)} days at 2hr/day)`;
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
</script>
