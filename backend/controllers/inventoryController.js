// Part B: Inventory Controller

const createInventory = async (db, req, res) => {
    try {
        const { supplier_id, product_name, quantity, price, category } = req.body;

        // Validation
        if (!supplier_id || !product_name || price <= 0 || quantity < 0) {
            return res.status(400).json({ error: 'Invalid input. Ensure price > 0 and quantity >= 0' });
        }

        // Check if supplier exists
        const supplier = await db.get('SELECT id FROM suppliers WHERE id = ?', [supplier_id]);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        const result = await db.run(
            'INSERT INTO inventory (supplier_id, product_name, quantity, price, category) VALUES (?, ?, ?, ?, ?)',
            [supplier_id, product_name, quantity, price, category]
        );

        res.status(201).json({ id: result.lastID, message: 'Inventory item created successfully' });
    } catch (error) {
        console.error('Create Inventory Error:', error);
        res.status(500).json({ error: 'Failed to create inventory item' });
    }
};

const getInventory = async (db, req, res) => {
    try {
        // Required Query: Grouped by supplier, sorted by total inventory value
        const query = `
            SELECT 
                s.name as supplier_name,
                SUM(i.quantity * i.price) as total_inventory_value,
                json_group_array(
                    json_object(
                        'id', i.id,
                        'product_name', i.product_name,
                        'quantity', i.quantity,
                        'price', i.price,
                        'category', i.category
                    )
                ) as items
            FROM suppliers s
            LEFT JOIN inventory i ON s.id = i.supplier_id
            GROUP BY s.id
            ORDER BY total_inventory_value DESC
        `;

        const results = await db.all(query);
        
        // Parse the items string (SQLite json_group_array returns a string)
        const formattedResults = results.map(row => ({
            ...row,
            items: JSON.parse(row.items)
        }));

        res.json(formattedResults);
    } catch (error) {
        console.error('Get Inventory Error:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};

module.exports = { createInventory, getInventory };
