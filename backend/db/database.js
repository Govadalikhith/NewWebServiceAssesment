const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function setupDatabase() {
    const db = await open({
        filename: path.join(__dirname, 'inventory.db'),
        driver: sqlite3.Database
    });

    // Create Suppliers Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            city TEXT NOT NULL
        )
    `);

    // Create Inventory Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            supplier_id INTEGER,
            product_name TEXT NOT NULL,
            quantity INTEGER DEFAULT 0 CHECK(quantity >= 0),
            price REAL DEFAULT 0 CHECK(price > 0),
            category TEXT,
            FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
        )
    `);

    // Seed initial data if empty
    const supplierCount = await db.get('SELECT COUNT(*) as count FROM suppliers');
    if (supplierCount.count === 0) {
        await db.run('INSERT INTO suppliers (name, city) VALUES (?, ?)', ['Global Tech', 'New York']);
        await db.run('INSERT INTO suppliers (name, city) VALUES (?, ?)', ['Evergreen Ltd', 'London']);
        
        await db.run('INSERT INTO inventory (supplier_id, product_name, quantity, price, category) VALUES (?, ?, ?, ?, ?)', 
            [1, 'Laptop Pro', 10, 1200, 'Electronics']);
        await db.run('INSERT INTO inventory (supplier_id, product_name, quantity, price, category) VALUES (?, ?, ?, ?, ?)', 
            [1, 'Wireless Mouse', 50, 25, 'Accessories']);
        await db.run('INSERT INTO inventory (supplier_id, product_name, quantity, price, category) VALUES (?, ?, ?, ?, ?)', 
            [2, 'Ergonomic Chair', 15, 300, 'Furniture']);
        await db.run('INSERT INTO inventory (supplier_id, product_name, quantity, price, category) VALUES (?, ?, ?, ?, ?)', 
            [2, 'Standing Desk', 8, 450, 'Furniture']);
        await db.run('INSERT INTO inventory (supplier_id, product_name, quantity, price, category) VALUES (?, ?, ?, ?, ?)', 
            [1, 'Monitor 4K', 12, 600, 'Electronics']);
    }

    return db;
}

module.exports = { setupDatabase };
