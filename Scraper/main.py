import sys
import json
import random
import math

def calculate_emissions(product_data):
    """Calculate carbon emissions for a product"""
    # Base emissions by category (kg CO2e)
    category_emissions = {
        'electronics': {'manufacturing': 150, 'shipping': 25, 'packaging': 5},
        'phones': {'manufacturing': 70, 'shipping': 8, 'packaging': 3},
        'laptops': {'manufacturing': 350, 'shipping': 45, 'packaging': 12},
        'shoes': {'manufacturing': 12, 'shipping': 6, 'packaging': 2},
        'furniture': {'manufacturing': 85, 'shipping': 35, 'packaging': 8},
        'appliances': {'manufacturing': 220, 'shipping': 55, 'packaging': 15},
        'cameras': {'manufacturing': 95, 'shipping': 18, 'packaging': 6},
        'gaming': {'manufacturing': 180, 'shipping': 28, 'packaging': 8},
        'general': {'manufacturing': 50, 'shipping': 15, 'packaging': 4}
    }
    
    # Detect category from product name
    query_lower = product_data['name'].lower()
    category = 'general'
    
    if any(word in query_lower for word in ['phone', 'iphone', 'samsung', 'android']):
        category = 'phones'
    elif any(word in query_lower for word in ['laptop', 'computer', 'macbook']):
        category = 'laptops'
    elif any(word in query_lower for word in ['shoes', 'nike', 'sneakers']):
        category = 'shoes'
    elif any(word in query_lower for word in ['chair', 'desk', 'furniture']):
        category = 'furniture'
    elif any(word in query_lower for word in ['camera', 'canon', 'nikon']):
        category = 'cameras'
    elif any(word in query_lower for word in ['gaming', 'playstation', 'xbox']):
        category = 'gaming'
    elif any(word in query_lower for word in ['tv', 'monitor', 'electronic']):
        category = 'electronics'
    
    base_emissions = category_emissions.get(category, category_emissions['general'])
    
    # Extract numeric price
    price = int(product_data['price'].replace('$', '').replace(',', ''))
    
    # Calculate multipliers
    price_multiplier = math.log(price / 100) * 0.3 if price > 0 else 0
    shipping_multiplier = get_shipping_multiplier(product_data['shipping'])
    condition_multiplier = get_condition_multiplier(product_data['condition'])
    
    # Calculate emissions
    manufacturing = base_emissions['manufacturing'] * (1 + price_multiplier) * condition_multiplier
    shipping = base_emissions['shipping'] * shipping_multiplier
    packaging = base_emissions['packaging']
    
    total = manufacturing + shipping + packaging
    
    return {
        'total': round(total, 1),
        'breakdown': {
            'manufacturing': round(manufacturing, 1),
            'shipping': round(shipping, 1),
            'packaging': round(packaging, 1)
        },
        'rating': get_emission_rating(total)
    }

def get_shipping_multiplier(shipping):
    """Get emission multiplier based on shipping type"""
    if 'Free' in shipping:
        return 1.0
    elif 'Express' in shipping or 'Next Day' in shipping:
        return 2.5
    elif 'Same Day' in shipping:
        return 4.0
    else:
        return 1.0

def get_condition_multiplier(condition):
    """Get emission multiplier based on product condition"""
    multipliers = {
        'New': 1.0,
        'Like New': 0.2,
        'Good Condition': 0.15,
        'Fair Condition': 0.1
    }
    return multipliers.get(condition, 1.0)

def get_emission_rating(emissions):
    """Get emission rating from A+ to E"""
    if emissions < 20:
        return 'A+'
    elif emissions < 50:
        return 'A'
    elif emissions < 100:
        return 'B'
    elif emissions < 200:
        return 'C'
    elif emissions < 400:
        return 'D'
    else:
        return 'E'

def scrape_product(query):
    # Enhanced mock data with more realistic product information
    mock_stores = ["Amazon", "eBay", "Best Buy", "Newegg", "Target", "Walmart"]
    conditions = ["New", "Like New", "Good Condition", "Fair Condition"]
    
    # Generate 4-8 random results
    results = []
    num_results = random.randint(4, 8)
    
    for i in range(num_results):
        store = random.choice(mock_stores)
        condition = random.choice(conditions)
        base_price = random.randint(15, 1500)
        
        # Adjust price based on condition
        if condition == "New":
            price = base_price
        elif condition == "Like New":
            price = int(base_price * 0.85)
        elif condition == "Good Condition":
            price = int(base_price * 0.70)
        else:
            price = int(base_price * 0.55)
        
        # Add some variety to product names
        product_variants = [
            f"{query}",
            f"{query} Pro",
            f"{query} Plus",
            f"{query} Premium",
            f"Original {query}",
        ]
        
        result = {
            "name": random.choice(product_variants),
            "condition": condition,
            "price": f"${price:,}",
            "store": store,
            "rating": round(random.uniform(3.5, 5.0), 1),
            "reviews": random.randint(10, 1000),
            "shipping": "Free Shipping" if random.choice([True, False]) else f"${random.randint(5, 20)} Shipping",
            "image": f"https://picsum.photos/200/200?random={i}",
            "numericPrice": price
        }
        
        # Calculate emissions for this product
        result["emissions"] = calculate_emissions(result)
        
        results.append(result)
    
    # Sort by emissions (lowest first) - eco-friendly default
    results.sort(key=lambda x: x["emissions"]["total"])
    
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(0)
    query = sys.argv[1]
    results = scrape_product(query)
    print(json.dumps(results))
