const express = require('express');
const router = express.Router();
const User  = require('../models/User');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/listUsers', authenticateToken, authorize('Admin'), async (req, res) => {
    try {
        const user = await User.findAll();
        res.json(user);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Error fetching User' });
    }
});


module.exports = router;
