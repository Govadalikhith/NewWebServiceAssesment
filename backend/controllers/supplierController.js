// Part B: Supplier Controller

const createSupplier = async (db, req, res) => {
    try {
        const { name, city } = req.body;

        if (!name || !city) {
            return res.status(400).json({ error: 'Name and City are required' });
        }

        const result = await db.run(
            'INSERT INTO suppliers (name, city) VALUES (?, ?)',
            [name, city]
        );

        res.status(201).json({ id: result.lastID, message: 'Supplier created successfully' });
    } catch (error) {
        console.error('Create Supplier Error:', error);
        res.status(500).json({ error: 'Failed to create supplier' });
    }
};

const getSuppliers = async (db, req, res) => {
    try {
        const results = await db.all('SELECT * FROM suppliers');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
};

module.exports = { createSupplier, getSuppliers };
