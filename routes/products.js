const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../config/multer');
const { Sequelize } = require('sequelize');

// Middleware untuk autentikasi dan otorisasi
// authenticateToken: Memastikan pengguna memiliki token yang valid
// authorize: Memastikan pengguna memiliki peran yang sesuai untuk mengakses rute tertentu

// Create product with image upload (WarehouseStaff only)
router.post('/', 
    authenticateToken, // Memastikan pengguna terautentikasi
    authorize(['Admin', 'WarehouseStaff']), // Memastikan hanya pengguna dengan peran 'Admin' atau 'WarehouseStaff' yang bisa mengakses
    upload.single('image'), // Mengunggah gambar produk
    async (req, res) => {
        try {
            const { productId, name, description, category, price, stockQuantity } = req.body;
            const image = req.file ? req.file.path : null;
            const product = await Product.create({ productId, name, description, category, price, stockQuantity, image });
            res.status(201).json(product);
        } catch (error) {
            console.error('Error creating product:', error);
            if (error instanceof Sequelize.ValidationError) {
                const messages = error.errors.map(e => e.message);
                res.status(400).json({ error: messages });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
});

// Update product with image upload (WarehouseStaff only)
router.put('/:productId', 
    authenticateToken, // Memastikan pengguna terautentikasi
    authorize(['Admin', 'WarehouseStaff']), // Memastikan hanya pengguna dengan peran 'Admin' atau 'WarehouseStaff' yang bisa mengakses
    upload.single('image'), // Mengunggah gambar produk
    async (req, res) => {
        const { productId } = req.params;
        const { name, description, category, price, stockQuantity } = req.body;
        const image = req.file ? req.file.path : null;
        try {
            await Product.update(
                { name, description, category, price, stockQuantity, image },
                { where: { productId } }
            );
            const updatedProduct = await Product.findByPk(productId);  
            res.json(updatedProduct);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(400).json({ error: 'Error updating product' });
        }
});

// Get all products
router.get('/', 
    async (req, res) => { // Rute ini tidak memerlukan autentikasi atau otorisasi
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (error) {
            res.status(400).json({ error: 'Error fetching products' });
        }
});

// Delete product (WarehouseStaff only)
router.delete('/:productId', 
    authenticateToken, // Memastikan pengguna terautentikasi
    authorize(['Admin', 'WarehouseStaff']), // Memastikan hanya pengguna dengan peran 'Admin' atau 'WarehouseStaff' yang bisa mengakses
    async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await Product.destroy({ where: { productId } });
            if (product) {
                res.status(200).json({ message: 'Product deleted successfully' });
            } else {
                res.status(404).json({ error: 'Product not found or not authorized to delete' });
            }
        } catch (error) {
            res.status(400).json({ error: 'Error deleting product' });
        }
});

module.exports = router;
