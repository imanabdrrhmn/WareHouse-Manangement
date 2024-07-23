const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Add new inventory (WarehouseStaff and Admin only)
router.post('/', authenticateToken, authorize(['WarehouseStaff', 'Admin']), async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const newInventory = await Inventory.create({ productId, quantity, lastUpdated: new Date() });
        res.status(201).json(newInventory);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Error adding inventory' });
    }
});

// Update inventory (WarehouseStaff only)
router.put('/:productId', authenticateToken, authorize(['WarehouseStaff', 'Admin']), async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
        const inventory = await Inventory.update({ quantity, lastUpdated: new Date() }, { where: { productId } });
        const updatedInventory = await Inventory.findByPk(productId);  
        res.json(updatedInventory);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Error updating inventory' });
    }
});

// View inventory (Admin and WarehouseStaff)
router.get('/listInventory', authenticateToken, authorize(['Admin', 'WarehouseStaff']), async (req, res) => {
    try {
        const inventory = await Inventory.findAll();
        res.json(inventory);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Error fetching inventory' });
    }
});

module.exports = router;
