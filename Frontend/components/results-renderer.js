function renderResults(results = []) {
    const container = document.querySelector('.results-container');
    if (!results.length) {
        container.innerHTML = "<p>No results found.</p>";
        return;
    }
    container.innerHTML = results.map(item => `
        <div class="result-item">
            <div><strong>${item.name}</strong></div>
            <div>Condition: ${item.condition}</div>
            <div>Price: ${item.price}</div>
        </div>
    `).join('');
}
