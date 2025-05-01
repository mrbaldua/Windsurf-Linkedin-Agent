// Add event listeners for post actions
document.addEventListener('DOMContentLoaded', () => {
    // Search extension functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchExtension = document.querySelector('.search-extension');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Show/hide search extension
    searchInput.addEventListener('focus', () => {
        searchExtension.classList.add('show');
        // Show the backdrop when search extension opens
        const backdrop = document.querySelector('.search-backdrop');
        backdrop.style.display = 'block';
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            if (!searchExtension.contains(document.activeElement)) {
                searchExtension.classList.remove('show');
                // Hide the backdrop when search extension closes
                const backdrop = document.querySelector('.search-backdrop');
                backdrop.style.display = 'none';
            }
        }, 100);
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Add tab content switching logic here
        });
    });

    // OpenAI API configuration
    const OPENAI_API_KEY = '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'; // Replace with your actual API key
    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

    // Search functionality
    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.trim();
        if (searchTerm.length < 3) return; // Only search if input is at least 3 characters

        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are a Small Business Onboarding & Setup agent. Provide a JSON array of search results without any code blocks or formatting. Format your response as: [{type: 'people'|'posts'|'groups'|'jobs'|'suggestion', title: string, description: string}]"
                           // content: "You are a Small Business Onboarding & Setup agent. Provide relevant LinkedIn-style search results for the given query. Format your response as an array of objects with the following structure: {type: 'people'|'posts'|'groups'|'jobs', title: string, description: string, image: string (optional)"
                            //                            content: "You are a Small Business Onboarding & Setup guide that leverages a user's Linkedin network along with the content posted by Linkedin members and the knowledge that exists on Linkedin via it's member posts. Your goal is to to assist small and medium-sized businesses (SMBs) setup their business presence on LinkedIn, as well as setting up their business in the real world, and providing coaching guidance to help them succeed. You offer tools for business setup, and provide customized coaching to SMBs. Ask clarifying questions if user prompt is not related to Small Business Onboarding & Setup.. Provide relevant LinkedIn-style search results for the given query. Format your response as a JSON array of objects with the following structure: {type: 'people'|'posts'|'groups'|'jobs', title: string, description: string, image: string (optional)"
                        },
                        {
                            role: "user",
                            content: `Search query: ${searchTerm}`
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // Clean up the JSON string by removing any code block markers
            let cleanedContent = content.replace(/```json\s*|```\s*/g, '');
            
            try {
                const results = JSON.parse(cleanedContent);
                displaySearchResults(results);
            } catch (e) {
                console.error('Error parsing JSON:', e);
                displayError('Error processing search results. Please try again.');
            }
        } catch (error) {
            console.error('Error searching:', error);
            displayError('Error occurred while searching. Please try again.');
        }
    });

    // Function to display search results
    function displaySearchResults(results) {
        const searchResults = document.querySelector('.search-results');
        searchResults.innerHTML = '';

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result';
            
            if (result.image) {
                resultElement.innerHTML = `
                    <img src="${result.image}" alt="${result.title}">
                    <div class="result-info">
                        <h3>${result.title}</h3>
                        <p>${result.description}</p>
                    </div>
                `;
            } else {
                resultElement.innerHTML = `
                    <div class="result-info">
                        <h3>${result.title}</h3>
                        <p>${result.description}</p>
                    </div>
                `;
            }

            searchResults.appendChild(resultElement);
        });
    }

    // Function to display error messages
    function displayError(message) {
        const searchResults = document.querySelector('.search-results');
        searchResults.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
    }

    // Post creation functionality
    const postTextarea = document.querySelector('.post-input textarea');
    postTextarea.addEventListener('input', () => {
        // Add post creation functionality here
        console.log('Post content:', postTextarea.value);
    });

    // Add smooth scrolling to the main content
    const mainContent = document.querySelector('.main-content');
    mainContent.addEventListener('wheel', (e) => {
        e.preventDefault();
        mainContent.scrollBy({
            top: e.deltaY,
            behavior: 'smooth'
        });
    });
});
