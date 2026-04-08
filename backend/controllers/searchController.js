// Part A: Search Controller
// Adhering to requirements: q (partial, case-insensitive), category (exact match), minPrice, maxPrice

const getSearch = async (db, req) => {
    try {
        const { q, category, minPrice, maxPrice } = req.query;
        let query = 'SELECT * FROM inventory WHERE 1=1';
        const params = [];

        if (q) {
            query += ' AND product_name LIKE ?';
            params.push(`%${q}%`);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (minPrice) {
            query += ' AND price >= ?';
            params.push(parseFloat(minPrice));
        }

        if (maxPrice) {
            query += ' AND price <= ?';
            params.push(parseFloat(maxPrice));
        }

        // Sorting by ID for consistency
        query += ' ORDER BY id DESC';

        const results = await db.all(query, params);
        return results;
    } catch (error) {
        console.error('Search Error:', error);
        throw new Error('Search failed');
    }
};

module.exports = { getSearch };
