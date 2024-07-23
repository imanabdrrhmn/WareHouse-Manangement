const express = require('express');
const router = express.Router();
const  Order = require('../models/Order');
const  User  = require('../models/User');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Create order (Customer only)
router.post('/', authenticateToken, authorize('Customer'), async (req, res) => {
    const { username, productId, quantity } = req.body;
    try {
        const order = await Order.create({ username, productId, quantity, orderDate: new Date() });
        res.status(201).json(order);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error creating order' });
    }
});
// View orders by username 
router.get('/user/:username', authenticateToken, authorize('Customer'), async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const orders = await Order.findAll({ where: { username } });
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching orders' });
    }
});

// View orders (Admin and Employee)
router.get('/listOrders', authenticateToken, authorize(['Admin','Employee']), async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching orders' });
    }
});

// Update order (Employee only)
router.put('/:id', authenticateToken, authorize(['WarehouseStaff', 'Admin']), async (req, res) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    try {
        const order = await Order.update({ productId, quantity }, { where: { id, userId: req.user.id } });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: 'Error updating order' });
    }
});

// Delete order (Employee only)
router.delete('/:id', authenticateToken, authorize(['WarehouseStaff', 'Admin']), async (req, res) => {
    const { id } = req.params;
    try {
        await Order.destroy({ where: { id } });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting order' });
    }
});

module.exports = router;
