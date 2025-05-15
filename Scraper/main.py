import sys
import json

def scrape_product(query):
    # Dummy data for demonstration; replace with real scraping logic
    return [
        {"name": f"{query} Example 1", "condition": "New", "price": "$100"},
        {"name": f"{query} Example 2", "condition": "Used", "price": "$80"}
    ]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(0)
    query = sys.argv[1]
    results = scrape_product(query)
    print(json.dumps(results))
