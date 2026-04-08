const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const inventoryController = require('../controllers/inventoryController');
const supplierController = require('../controllers/supplierController');

module.exports = (db) => {
    // Part A: Search
    router.get('/search', async (req, res) => {
        try {
            const results = await searchController.getSearch(db, req);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Part B: Suppliers
    router.post('/supplier', (req, res) => supplierController.createSupplier(db, req, res));
    router.get('/suppliers', (req, res) => supplierController.getSuppliers(db, req, res));

    // Part B: Inventory
    router.post('/inventory', (req, res) => inventoryController.createInventory(db, req, res));
    router.get('/inventory', (req, res) => inventoryController.getInventory(db, req, res));

    return router;
};
