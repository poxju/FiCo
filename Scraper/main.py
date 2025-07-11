import sys
import json
import random

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
            "image": f"https://picsum.photos/200/200?random={i}"
        }
        results.append(result)
    
    # Sort by price (lowest first)
    results.sort(key=lambda x: int(x["price"].replace("$", "").replace(",", "")))
    
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(0)
    query = sys.argv[1]
    results = scrape_product(query)
    print(json.dumps(results))
