// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const path = require('path');

const authRoutes = require('./routes/Auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const fileRoutes = require('./routes/files');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');

app.use(bodyParser.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/files', fileRoutes);
app.use('/orders', orderRoutes);
app.use('/inventory', inventoryRoutes);

app.get('/', (req, res) => {
    res.send('API is working');
});

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
