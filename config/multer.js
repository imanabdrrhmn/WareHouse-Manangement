const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/images');
        } else if (file.mimetype === 'application/pdf') {
            cb(null, 'uploads/files');
        } else {
            cb({ message: 'This file is neither a PDF nor an image file' }, false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb({ message: 'Unsupported file format' }, false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = upload;
