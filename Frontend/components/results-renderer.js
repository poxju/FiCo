function renderResults(results = []) {
    const container = document.querySelector('.results-container');
    if (!results.length) {
        container.innerHTML = `
            <div class="no-results">
                <h3>🔍 No results found</h3>
                <p>Please try a different search term</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="results-header">
            <h2>🛍️ ${results.length} results found</h2>
            <div class="sort-options">
                <select onchange="sortResults(this.value)">
                    <option value="price">Sort by price</option>
                    <option value="rating">Sort by rating</option>
                    <option value="store">Sort by store</option>
                </select>
            </div>
        </div>
        <div class="card-list">
            ${results.map((item, index) => `
                <div class="result-card" data-index="${index}">
                    <div class="card-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        ${item.shipping === "Free Shipping" || item.shipping === "Ücretsiz Kargo" ? '<div class="free-shipping">📦 Free Shipping</div>' : ''}
                    </div>
                    <div class="card-content">
                        <div class="card-title">${item.name}</div>
                        <div class="card-store">🏪 ${item.store}</div>
                        <div class="card-rating">
                            <span class="stars">${generateStars(item.rating)}</span>
                            <span class="rating-text">${item.rating} (${item.reviews} reviews)</span>
                        </div>
                        <div class="card-condition-badge ${getConditionClass(item.condition)}">
                            ${translateCondition(item.condition)}
                        </div>
                        <div class="card-footer">
                            <div class="card-price">${item.price}</div>
                            <div class="card-shipping">${translateShipping(item.shipping)}</div>
                        </div>
                        <button class="view-product-btn" onclick="viewProduct(${index})">
                            View Product 👀
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Store results globally for sorting
    window.currentResults = results;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    if (hasHalfStar) {
        stars += '⭐';
    }
    while (stars.length < 10) { // 5 stars max, each star is 2 chars
        stars += '☆';
    }
    
    return stars.substring(0, 10);
}

function translateCondition(condition) {
    const translations = {
        'Yeni': 'New',
        'Az Kullanılmış': 'Like New',
        'İyi Durumda': 'Good Condition',
        'Orta Durumda': 'Fair Condition'
    };
    return translations[condition] || condition;
}

function translateShipping(shipping) {
    if (shipping === 'Ücretsiz Kargo') {
        return 'Free Shipping';
    }
    // Convert TL to $ for shipping costs
    const match = shipping.match(/₺(\d+)/);
    if (match) {
        return `$${Math.round(parseInt(match[1]) / 30)} Shipping`;
    }
    return shipping;
}

function getConditionClass(condition) {
    const translated = translateCondition(condition);
    switch (translated) {
        case 'New': return 'condition-new';
        case 'Like New': return 'condition-like-new';
        case 'Good Condition': return 'condition-good';
        case 'Fair Condition': return 'condition-fair';
        default: return 'condition-unknown';
    }
}

function sortResults(criteria) {
    if (!window.currentResults) return;
    
    let sorted = [...window.currentResults];
    
    switch (criteria) {
        case 'price':
            sorted.sort((a, b) => {
                const priceA = parseInt(a.price.replace(/[₺$,]/g, ''));
                const priceB = parseInt(b.price.replace(/[₺$,]/g, ''));
                return priceA - priceB;
            });
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'store':
            sorted.sort((a, b) => a.store.localeCompare(b.store));
            break;
    }
    
    renderResults(sorted);
}

function viewProduct(index) {
    const product = window.currentResults[index];
    alert(`${product.name} product will be viewed from ${product.store} store...`);
    // In real application, this would redirect to the actual product link
}
