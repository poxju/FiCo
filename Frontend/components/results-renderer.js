function renderResults(results = []) {
    const container = document.querySelector('.results-container');
    if (!results.length) {
        container.innerHTML = "<p>No results found.</p>";
        return;
    }
    container.innerHTML = `
        <div class="card-list">
            ${results.map(item => `
                <div class="result-card">
                    <div class="card-title">${item.name}</div>
                    <div class="card-details">
                        <span class="card-condition">${item.condition}</span>
                        <span class="card-price">${item.price}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
