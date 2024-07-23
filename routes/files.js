const express = require('express');
const router = express.Router();
const { File } = require('../models/File');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../config/multer');

// Upload file (Employee only)
router.post('/', authenticateToken, authorize(['Employee', 'Admin']), upload.single('file'), async (req, res) => {
    const { name, description, category, uploadedBy, } = req.body;
    const file = req.file ? req.file.path : null;
    try {
        const files = await File.create({ name, description, category, file, uploadedBy});
        res.status(201).json(files);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Error uploading file' });
    }
});

// Update file (Employee only)
router.put('/:id', authenticateToken, authorize(['Employee', 'Admin']), upload.single('file'), async (req, res) => {
    const { id } = req.params;
    const { name, description, category } = req.body;
    const file = req.file ? req.file.path : null;
    try {
        await File.update(
            { name, description, category, file },
            { where: { id} }
        );
        const updatedFile = await File.findByPk(id);  // Fetch updated product
        res.json(updatedFile);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Error updating file' });
    }
});

router.get('/listFiles', authenticateToken, authorize(['Employee', 'Admin']), async (req, res) => {
    try {
        const file = await File.findAll();
        res.json(file);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching File' });
    }
});

// Delete file (Employee only)
router.delete('/:id', authenticateToken, authorize(['Employee', 'Admin']), async (req, res) => {
    const { id } = req.params;
    try {
        const file = await File.destroy({ where: { id} });
        if (file) {
            res.status(200).json({ message: 'File deleted successfully' });
        } else {
            res.status(404).json({ error: 'File not found or not authorized to delete' });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Error deleting file' });
    }
});

module.exports = router;
