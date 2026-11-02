const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'products.db');
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
const db = new Database(dbPath);
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
db.exec(schema);
db.exec(seed);
const total = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
db.close();
console.log(`Database created successfully with ${total} sample products.`);
