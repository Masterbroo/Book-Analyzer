document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded");

    const bookInput = document.getElementById('bookInput');
    const fetchButton = document.getElementById('fetchSummary');
    const responseDiv = document.getElementById('response');

    if (!bookInput || !fetchButton || !responseDiv) {
        console.error("❌ Missing essential elements in DOM!");
        return;
    }

    fetchButton.addEventListener("click", getBookSummary);

    bookInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            getBookSummary();
        }
    });

    async function getBookSummary() {
        const bookTitle = bookInput.value.trim();
        if (!bookTitle) {
            alert("Please enter a book title!");
            return;
        }

        responseDiv.textContent = "⏳ Fetching summary...";

        const API_KEY = "AIzaSyAPEAzj1YO2bZ7r5eB4aTibqnUSVlKpolE"; // Secure this in a backend for production
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Give a short summary of the book "${bookTitle}" give the page count, author, audience rating in emoji star and in numberic value out of 5, related books as bulleted points. you can add emojis too alongside. no need of bold font style. . Just output the text, no JSON.`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const summaryText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

            if (!summaryText) throw new Error("No summary received!");

            responseDiv.textContent = summaryText;

        } catch (error) {
            responseDiv.textContent = `❌ Error: ${error.message}`;
        }
    }
});
