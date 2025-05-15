const express = require('express')
const { exec } = require('child_process')
const cors = require("cors")
const app = express()
const port = 3000

app.use(cors());

app.get('/', (req, res) => {
  res.send('Working!')
})
app.get("/favicon.ico", (req, res) => res.status(204));

// New endpoint to trigger scraper and return results
app.get('/api/search', (req, res) => {
  const query = req.query.query
  if (!query) return res.status(400).json({ error: 'Missing query' })

  // Run the Python scraper with the query as an argument
  exec(`python ../Scraper/main.py "${query}"`, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message })
    }
    try {
      // Expect scraper to output JSON
      const results = JSON.parse(stdout)
      res.json(results)
    } catch (e) {
      res.status(500).json({ error: 'Invalid scraper output', details: stdout })
    }
  })
})

app.listen(port, () => {
  console.log(`FiCo app listening on port http://localhost:${port}`)
})
