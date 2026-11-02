const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database', 'products.db');

// Create and seed the database automatically on the first run.
if (!fs.existsSync(dbPath)) require('./database/setup');
const db = new Database(dbPath, { fileMustExist: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/products?q=watch&category=Accessories&minPrice=100&maxPrice=3000
app.get('/api/products', (req, res) => {
  const { q = '', category = '', minPrice, maxPrice } = req.query;
  const conditions = [];
  const params = {};

  if (typeof q !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ error: 'Search and category must be text values.' });
  }
  if (q.trim()) {
    conditions.push('(name LIKE @search OR description LIKE @search)');
    params.search = `%${q.trim()}%`;
  }
  if (category.trim()) {
    conditions.push('category = @category');
    params.category = category.trim();
  }
  if (minPrice !== undefined && minPrice !== '') {
    const value = Number(minPrice);
    if (!Number.isFinite(value) || value < 0) return res.status(400).json({ error: 'minPrice must be a non-negative number.' });
    conditions.push('price >= @minPrice'); params.minPrice = value;
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    const value = Number(maxPrice);
    if (!Number.isFinite(value) || value < 0) return res.status(400).json({ error: 'maxPrice must be a non-negative number.' });
    conditions.push('price <= @maxPrice'); params.maxPrice = value;
  }
  if (params.minPrice !== undefined && params.maxPrice !== undefined && params.minPrice > params.maxPrice) {
    return res.status(400).json({ error: 'minPrice cannot be greater than maxPrice.' });
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const products = db.prepare(`SELECT * FROM products ${where} ORDER BY id DESC`).all(params);
  res.json({ count: products.length, products });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Product ID must be a positive integer.' });
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json(product);
});

// GET /api/categories
app.get('/api/categories', (_req, res) => {
  const categories = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all().map(row => row.category);
  res.json({ categories });
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`ShopStack is running at http://localhost:${PORT}`));
