# ShopStack — Product Listing Website (Part 1)

A simple full-stack product catalogue built for the **Part 1: Product Listing Website** lab assignment. The frontend displays products and details, while an Express REST API reads catalogue data from a relational SQLite database.

## Features

- Responsive product listing page with product images, descriptions, prices and categories.
- Individual product details page, including stock information.
- Search by product name or description.
- Filter by category and minimum/maximum price.
- REST API with request validation and useful HTTP status codes.
- SQLite database schema and 12 sample products.
- Database is created and seeded automatically on first server start.

## Technology

- Frontend: HTML5, CSS3 and vanilla JavaScript
- Backend: Node.js and Express.js
- Database: SQLite using `better-sqlite3`

## Prerequisites

- Node.js 18 or newer (Node.js 20+ recommended)
- npm (included with Node.js)
- Git (to clone the repository)

## Run locally

1. Clone or download this repository.

   ```bash
   git clone <your-repository-url>
   cd shopstack
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create/reset the SQLite database and insert sample products (optional; the server also does this automatically if the database does not exist).

   ```bash
   npm run db:setup
   ```

4. Start the application.

   ```bash
   npm start
   ```

5. Open **http://localhost:3000** in your browser. Open a product card to see its details.

For development with automatic server restart, use `npm run dev`.

## Project structure

```text
shopstack/
├── database/
│   ├── schema.sql       # Products table and indexes
│   ├── seed.sql         # Sample catalogue data
│   └── setup.js         # Creates and seeds SQLite database
├── public/
│   ├── css/styles.css   # Responsive styling
│   ├── js/app.js        # Listing, search and filters
│   ├── js/product.js    # Product details view
│   ├── index.html       # Product listing page
│   └── product.html     # Product details page
├── screenshots/        # Listing and details screenshots
├── server.js           # Express server and REST API
├── package.json
└── README.md
```

## Architecture

The application uses a simple three-layer architecture:

1. **Frontend (browser):** `index.html` and `product.html` provide the user interface. JavaScript calls the backend using `fetch()` and renders the returned JSON.
2. **Backend (Express):** `server.js` receives API requests, validates query parameters and product IDs, runs SQL queries and returns JSON with appropriate status codes.
3. **Database (SQLite):** `database/products.db` stores product information in the `products` table. The frontend never accesses the database directly; all catalogue data passes through the REST API.

The SQLite database file is generated locally and is excluded from Git. The schema and sample data scripts are committed, so another person can recreate the database using `npm run db:setup`.

## REST API

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/products` | Get all products | 200 OK |
| GET | `/products?q=watch` | Search name and description | 200 OK |
| GET | `/products?category=Home` | Filter by category | 200 OK |
| GET | `/products?minPrice=500&maxPrice=2000` | Filter by price range | 200 OK |
| GET | `/products/:id` | Get one product by ID | 200 OK |
| GET | `/categories` | Get available categories | 200 OK |
| GET | `/health` | Check API status | 200 OK |

### Example responses

`GET /api/products` returns:

```json
{
  "count": 12,
  "products": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "description": "Enjoy rich, balanced sound...",
      "price": 2499,
      "category": "Electronics",
      "image_url": "https://...",
      "stock": 24
    }
  ]
}
```

`GET /api/products/1` returns one product object. Error responses use JSON, for example `{ "error": "Product not found." }`.

### HTTP status codes

- `200 OK` — request completed successfully.
- `400 Bad Request` — invalid product ID or invalid filter value.
- `404 Not Found` — product ID does not exist.

## Database

Table: `products`

| Column | Type | Rules |
|---|---|---|
| id | INTEGER | Primary key, auto increment |
| name | TEXT | Required |
| description | TEXT | Required |
| price | REAL | Required, zero or greater |
| category | TEXT | Required |
| image_url | TEXT | Required |
| stock | INTEGER | Required, zero or greater |
| created_at | DATETIME | Defaults to current timestamp |

The sample catalogue is in `database/seed.sql`. Product images are loaded from remote Unsplash image URLs, so an internet connection is needed to display those images.

## Screenshots

- `screenshots/product-listing.png` — catalogue with product cards and filters.
- `screenshots/product-details.png` — individual product details view.

## Git submission

After reviewing the project, create and push your repository:

```bash
git init
git add .
git commit -m "Build full-stack product listing website"
git branch -M main
git remote add origin <your-github-repository-url>
git push -u origin main
```

Replace the remote URL with the repository URL created in your Git hosting account.
