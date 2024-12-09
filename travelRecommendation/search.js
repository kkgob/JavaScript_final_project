// search.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    // If no query provided, do nothing or show a message.
    if (!query) {
        document.getElementById('results').innerHTML = "<p class='no-results'>Please enter a keyword and click Search.</p>";
        return;
    }

    // Normalize the query to lowercase
    const keyword = query.toLowerCase();

    // Fetch data from the JSON
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // data expected to have { "countries": [ ... ] }
            const countries = data.countries;

            // Filter logic:
            // Here we can define some rules:
            // - If user searches for variations of "beach", check if the keyword includes "beach"
            // - Similarly for "temple" or "country"
            //
            // You can customize this logic as needed.
            // For now, let's say we just look for these three keywords in each city's description or name.
            let filteredResults = [];

            countries.forEach(country => {
                country.cities.forEach(city => {
                    // Combine name and description, and convert to lowercase
                    const cityData = (city.name + " " + city.description).toLowerCase();

                    // If keyword is 'beach' and cityData includes 'beach' or 'beaches'
                    // If keyword is 'temple' and cityData includes 'temple'
                    // If keyword is 'country' and cityData includes 'country'
                    // Or simply check if cityData includes the keyword:
                    if (cityData.includes(keyword)) {
                        filteredResults.push({
                            name: city.name,
                            imageUrl: city.imageUrl,
                            description: city.description
                        });
                    }
                });
            });

            displayResults(filteredResults, keyword);
        })
        .catch(error => {
            console.error("Fetch error:", error);
            document.getElementById('results').innerHTML = "<p class='no-results'>Could not load data. Please try again later.</p>";
        });
});

function displayResults(results, keyword) {
    const resultsContainer = document.getElementById('results');

    if (results.length === 0) {
        resultsContainer.innerHTML = `<p class='no-results'>No results found for "${keyword}".</p>`;
        return;
    }

    let html = "";
    results.forEach(item => {
        html += `
            <div class="recommendation">
                <img src="${item.imageUrl}" alt="${item.name}" />
                <div class="recommendation-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <button class="visit-button">Visit</button>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = html;
}