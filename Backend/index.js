const express = require('express')
const { exec } = require('child_process')
const path = require('path')
const cors = require("cors")

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());

// Serve static files from Frontend directory
app.use('/Frontend', express.static(path.join(__dirname, '../Frontend')));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'FiCo Backend API Running! 🚀',
    version: '1.0.0',
    endpoints: {
      search: '/api/search?query=<product_name>',
      aiSearch: '/api/ai-search',
      health: '/health'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Favicon
app.get("/favicon.ico", (req, res) => res.status(204));

// Search endpoint - triggers Python scraper
app.get('/api/search', (req, res) => {
  const query = req.query.query?.trim();
  
  if (!query) {
    return res.status(400).json({ 
      error: 'Search term required',
      message: 'Please specify the product to search for'
    });
  }

  console.log(`🔍 Product search: "${query}"`);

  // Python scraper'ı çalıştır
  const pythonPath = path.join(__dirname, '../Scraper/main.py');
  const command = `python3 "${pythonPath}" "${query}"`;
  
  exec(command, { 
    cwd: __dirname,
    timeout: 30000, // 30 saniye timeout
    encoding: 'utf8'
  }, (error, stdout, stderr) => {
    
    if (error) {
      console.error('❌ Scraper error:', error.message);
      console.error('stderr:', stderr);
      
      return res.status(500).json({ 
        error: 'Error occurred during product search',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stderr: stderr
        } : undefined
      });
    }
    
    try {
      // Python script'inden JSON çıktısını parse et
      const results = JSON.parse(stdout.trim());
      
      console.log(`✅ ${results.length} results found: "${query}"`);
      
      res.json(results);
      
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('stdout:', stdout);
      
      res.status(500).json({ 
        error: 'Invalid scraper output',
        details: process.env.NODE_ENV === 'development' ? {
          stdout: stdout,
          parseError: parseError.message
        } : undefined
      });
    }
  });
});

// AI Search endpoint - provides intelligent product recommendations
app.post('/api/ai-search', (req, res) => {
  const { query } = req.body;
  
  if (!query?.trim()) {
    return res.status(400).json({ 
      error: 'Search term required',
      message: 'Please specify the product to search for'
    });
  }

  console.log(`🤖 AI Search: "${query}"`);

  // AI analysis simulation - in real implementation, this would call OpenAI/Claude API
  const aiResponse = generateAIResponse(query);
  const products = generateAIProducts(query);
  
  console.log(`✅ AI generated ${products.length} recommendations`);
  
  res.json({
    response: aiResponse,
    products: products,
    query: query,
    timestamp: new Date().toISOString()
  });
});

// Generate AI-like response based on query
function generateAIResponse(query) {
  const lowerQuery = query.toLowerCase();
  
  // Budget analysis
  const budgetMatch = query.match(/(\d+)\s*(usd|dollars?|\$)/i);
  const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;
  
  // Category detection
  let category = 'general';
  const categories = {
    'phone|iphone|samsung|android|smartphone': 'phone',
    'laptop|computer|macbook|notebook': 'laptop',
    'shoes|nike|adidas|sneakers|footwear': 'shoes',
    'chair|furniture|desk|office': 'furniture',
    'refrigerator|fridge|appliance|kitchen': 'appliance',
    'camera|photography|canon|nikon': 'camera',
    'gaming|game|playstation|xbox|console': 'gaming'
  };
  
  for (const [pattern, cat] of Object.entries(categories)) {
    if (new RegExp(pattern, 'i').test(lowerQuery)) {
      category = cat;
      break;
    }
  }
  
  // Generate personalized response
  let response = `Analysis complete! `;
  
  if (budget) {
    if (budget < 300) {
      response += `For your $${budget} budget, I've prioritized affordable options. `;
    } else if (budget < 1500) {
      response += `For your $${budget} budget, I've selected quality mid-range products. `;
    } else {
      response += `For your $${budget} budget, I've recommended premium quality products. `;
    }
  }
  
  const categoryResponses = {
    'phone': 'I prioritized models with current technology and long support periods.',
    'laptop': 'I ranked them based on performance, battery life, and portability.',
    'shoes': 'I found the most suitable options in terms of comfort, durability, and style.',
    'furniture': 'I listed options that meet ergonomic and quality standards.',
    'appliance': 'I found the best options for energy efficiency and durability.',
    'camera': 'I recommended based on photo quality and ease of use.',
    'gaming': 'I made performance and gaming experience focused selections.',
    'general': 'I selected products with the best quality-price ratio.'
  };
  
  response += categoryResponses[category] || categoryResponses['general'];
  response += ' Here are my recommendations that are most suitable for you:';
  
  return response;
}

// Generate AI-curated products based on query analysis
function generateAIProducts(query) {
  const lowerQuery = query.toLowerCase();
  const budgetMatch = query.match(/(\d+)\s*(usd|dollars?|\$)/i);
  const budget = budgetMatch ? parseInt(budgetMatch[1]) : 600; // Default budget
  
  // Determine product category and base products
  let baseProducts = [];
  
  if (/phone|iphone|samsung|android|smartphone/i.test(lowerQuery)) {
    baseProducts = [
      { name: 'iPhone 14', basePrice: 800, category: 'phone', rating: 4.8 },
      { name: 'Samsung Galaxy S23', basePrice: 650, category: 'phone', rating: 4.6 },
      { name: 'Xiaomi Redmi Note 12', basePrice: 250, category: 'phone', rating: 4.4 },
      { name: 'OnePlus Nord CE 3', basePrice: 400, category: 'phone', rating: 4.5 },
      { name: 'Google Pixel 7a', basePrice: 500, category: 'phone', rating: 4.7 }
    ];
  } else if (/laptop|computer|macbook|notebook/i.test(lowerQuery)) {
    baseProducts = [
      { name: 'MacBook Air M2', basePrice: 1200, category: 'laptop', rating: 4.9 },
      { name: 'Asus VivoBook 15', basePrice: 500, category: 'laptop', rating: 4.3 },
      { name: 'Lenovo ThinkPad E15', basePrice: 700, category: 'laptop', rating: 4.5 },
      { name: 'HP Pavilion Gaming', basePrice: 800, category: 'laptop', rating: 4.4 },
      { name: 'Acer Aspire 5', basePrice: 400, category: 'laptop', rating: 4.2 }
    ];
  } else if (/shoes|nike|adidas|sneakers/i.test(lowerQuery)) {
    baseProducts = [
      { name: 'Nike Air Max 270', basePrice: 80, category: 'shoes', rating: 4.6 },
      { name: 'Adidas Ultraboost 22', basePrice: 100, category: 'shoes', rating: 4.7 },
      { name: 'Puma RS-X', basePrice: 60, category: 'shoes', rating: 4.4 },
      { name: 'New Balance 574', basePrice: 75, category: 'shoes', rating: 4.5 },
      { name: 'Converse Chuck Taylor', basePrice: 40, category: 'shoes', rating: 4.3 }
    ];
  } else {
    // Default mixed products
    baseProducts = [
      { name: 'Quality Product 1', basePrice: budget * 0.8, category: 'general', rating: 4.5 },
      { name: 'Premium Choice', basePrice: budget * 1.2, category: 'general', rating: 4.7 },
      { name: 'Budget Option', basePrice: budget * 0.6, category: 'general', rating: 4.3 },
      { name: 'Mid-Range', basePrice: budget, category: 'general', rating: 4.4 }
    ];
  }
  
  // Generate products with AI-like optimization
  const stores = ["Amazon", "eBay", "Best Buy", "Newegg", "Target"];
  const conditions = ["New", "Like New", "Good Condition"];
  
  const products = baseProducts.map((product, index) => {
    // Adjust price based on budget
    let adjustedPrice = product.basePrice;
    if (budget < product.basePrice * 0.8) {
      adjustedPrice = Math.max(product.basePrice * 0.7, budget * 0.8);
    }
    
    // Add some randomness but keep it logical
    const priceVariation = adjustedPrice * (0.8 + Math.random() * 0.4);
    const finalPrice = Math.round(priceVariation);
    
    return {
      name: product.name,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      price: `$${finalPrice.toLocaleString()}`,
      store: stores[Math.floor(Math.random() * stores.length)],
      rating: product.rating + (Math.random() * 0.4 - 0.2), // Slight variation
      reviews: Math.floor(Math.random() * 800) + 50,
      shipping: Math.random() > 0.3 ? "Free Shipping" : `$${Math.floor(Math.random() * 15) + 5} Shipping`,
      image: `https://picsum.photos/200/200?random=${Date.now() + index}`,
      aiScore: Math.round((product.rating * 20) + Math.random() * 10) // AI recommendation score
    };
  });
  
  // Sort by AI score (best recommendations first)
  return products.sort((a, b) => b.aiScore - a.aiScore);
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} endpoint does not exist`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

app.listen(port, () => {
  console.log(`🚀 FiCo Backend server running: http://localhost:${port}`);
  console.log(`📱 Frontend: http://localhost:${port}/Frontend/`);
  console.log(`🔍 API Test: http://localhost:${port}/api/search?query=iPhone`);
});
