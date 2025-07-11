# 🛍️ FiCo – Find&Compare

**FiCo** is a lightweight and user-friendly Single Page Application (SPA) that helps you **find the cheapest products** online and **compare sellers, conditions, and pricing** all in one place. Built with **vanilla JavaScript**, FiCo offers a fast and distraction-free product comparison experience.

---

## 🔍 Features

- 🛒 **Product Finder**: Search for products instantly
- 🔄 **Smart Comparison**: See product conditions and sellers side by side  
- ⭐ **Rating System**: View ratings and reviews for informed decisions
- � **Multi-Store Support**: Compare prices across different stores
- 📦 **Shipping Info**: See shipping costs and free shipping options
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- �🌐 **Open Source**: MIT licensed and ready to be improved

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.x

### Installation & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/poxju/FiCo.git
   cd FiCo
   ```

2. **Start the development environment**
   ```bash
   ./start.sh
   ```
   
   Or manually:
   ```bash
   cd Backend
   npm install
   node index.js
   ```

3. **Open your browser**
   - Frontend: http://localhost:3000/Frontend/
   - API Test: http://localhost:3000/api/search?query=iPhone

---

## 🏗️ Project Structure

```
FiCo/
├── Frontend/           # Client-side application
│   ├── index.html     # Main HTML file
│   ├── styles/        # CSS stylesheets
│   └── components/    # JavaScript components
├── Backend/           # Express.js API server
│   ├── index.js      # Main server file
│   └── package.json  # Dependencies
├── Scraper/          # Python web scraper
│   └── main.py      # Scraping logic (currently mock data)
└── start.sh         # Development startup script
```

---

## 🔧 Development

### Current Status
- ✅ Modern responsive UI/UX
- ✅ Enhanced mock data with realistic product information
- ✅ Sorting and filtering capabilities
- ✅ Error handling and loading states
- 🔄 Real web scraping (coming soon)

### Adding Real Data Sources

The scraper (`Scraper/main.py`) currently returns mock data. To add real scraping:

1. Install required Python packages:
   ```bash
   pip install requests beautifulsoup4 selenium
   ```

2. Modify `scrape_product()` function in `main.py` to scrape real websites

3. Follow each website's robots.txt and terms of service

---

## 🎨 UI/UX Features

- **Gradient Background**: Beautiful purple gradient design
- **Glass Morphism**: Modern frosted glass effects
- **Smooth Animations**: Hover effects and transitions
- **Responsive Design**: Works perfectly on mobile and desktop
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error messages
- **Sorting Options**: Sort by price, rating, or store
- **Product Cards**: Rich product information display

---

## 🛡️ License

This project is licensed under the [MIT License](./LICENSE).  
© 2025 poxju

---

## 🙌 Contributions

Pull requests, feedback, and suggestions are welcome! Feel free to fork the repo and build something awesome.

### TODOs
- [ ] Implement real web scraping for major e-commerce sites
- [ ] Add more sorting and filtering options
- [ ] Implement user favorites/wishlist
- [ ] Add price history tracking
- [ ] Mobile app version
- [ ] Eco-Friendly searching

---

## 📞 Support

If you encounter any issues:
1. Check that Python 3.x is installed
2. Ensure Node.js dependencies are installed (`npm install` in Backend/)
3. Verify the backend server is running on port 3000
4. Check browser console for any JavaScript errors

