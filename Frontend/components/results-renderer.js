function renderResults(results = []) {
    // Store results globally for sorting
    window.currentResults = results;
    
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
            <p class="eco-message">🌱 Sorted by carbon footprint - helping you choose eco-friendly options!</p>
            <div class="sort-options">
                <select onchange="sortResults(this.value)">
                    <option value="emissions">🌱 Sort by emissions (eco-friendly)</option>
                    <option value="price">💰 Sort by price</option>
                    <option value="rating">⭐ Sort by rating</option>
                    <option value="store">🏪 Sort by store</option>
                </select>
            </div>
        </div>
        </div>
        <div class="products-list">
            ${results.map((item, index) => `
                <div class="product-item ${item.emissions && (item.emissions.rating === 'A+' || item.emissions.rating === 'A') ? 'eco-friendly' : ''}" data-index="${index}">
                    <div class="product-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        ${item.emissions && item.emissions.rating === 'A+' ? '<div class="eco-badge">🌱 BEST ECO</div>' : ''}
                        ${item.shipping === "Free Shipping" || item.shipping === "Ücretsiz Kargo" ? '<div class="free-shipping">📦 Free</div>' : ''}
                    </div>
                    <div class="product-details">
                        <div class="product-header">
                            <h3 class="product-title">${item.name}</h3>
                            <div class="product-price">${item.price}</div>
                        </div>
                        <div class="product-meta">
                            <span class="product-store">🏪 ${item.store}</span>
                            <span class="product-condition ${getConditionClass(item.condition)}">
                                ${translateCondition(item.condition)}
                            </span>
                            <span class="product-rating">
                                ${generateStars(item.rating)} ${item.rating} (${item.reviews})
                            </span>
                        </div>
                        ${item.emissions ? `
                        <div class="product-emissions">
                            <span class="emissions-rating ${getEmissionRatingClass(item.emissions.rating)}">
                                🌱 ${item.emissions.rating}
                            </span>
                            <span class="emissions-value">
                                ${item.emissions.total} kg CO₂e
                                <span class="emissions-tooltip" onclick="showEmissionsBreakdown(${index})">ℹ️</span>
                            </span>
                        </div>
                        ` : ''}
                        <div class="product-actions">
                            <span class="product-shipping">${translateShipping(item.shipping)}</span>
                            <button class="view-btn" onclick="viewProduct(${index})">
                                View Product →
                            </button>
                        </div>
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

function getEmissionRatingClass(rating) {
    const classes = {
        'A+': 'emission-a-plus',
        'A': 'emission-a',
        'B': 'emission-b',
        'C': 'emission-c',
        'D': 'emission-d',
        'E': 'emission-e'
    };
    return classes[rating] || 'emission-default';
}

function showEmissionsBreakdown(index) {
    const results = window.currentResults || [];
    const item = results[index];
    if (!item || !item.emissions) return;
    
    const breakdown = item.emissions.breakdown;
    alert(`Carbon Footprint Breakdown for ${item.name}:

Manufacturing: ${breakdown.manufacturing} kg CO₂e
Shipping: ${breakdown.shipping} kg CO₂e  
Packaging: ${breakdown.packaging} kg CO₂e

Total: ${item.emissions.total} kg CO₂e
Rating: ${item.emissions.rating}

💡 Tip: Choose refurbished items to reduce manufacturing emissions!`);
}

function sortResults(criteria) {
    const results = window.currentResults || [];
    if (!results.length) return;
    
    let sortedResults = [...results];
    
    switch(criteria) {
        case 'emissions':
            sortedResults.sort((a, b) => {
                const aEmissions = a.emissions ? a.emissions.total : 999;
                const bEmissions = b.emissions ? b.emissions.total : 999;
                return aEmissions - bEmissions;
            });
            break;
        case 'price':
            sortedResults.sort((a, b) => {
                const aPrice = parseInt(a.price.replace(/[$,]/g, '')) || 0;
                const bPrice = parseInt(b.price.replace(/[$,]/g, '')) || 0;
                return aPrice - bPrice;
            });
            break;
        case 'rating':
            sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'store':
            sortedResults.sort((a, b) => (a.store || '').localeCompare(b.store || ''));
            break;
    }
    
    renderResults(sortedResults);
}

function viewProduct(index) {
    const product = window.currentResults[index];
    alert(`${product.name} product will be viewed from ${product.store} store...`);
    // In real application, this would redirect to the actual product link
}
