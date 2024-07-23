const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { 
        type: DataTypes.STRING, 
        allowNull: false,
        references: {
            model: 'Users',
            key: 'username'
        },
    },
    productId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Products',
            key: 'productId',
        },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    orderDate: { type: DataTypes.DATE, allowNull: false }
}, {
    timestamps: false
});

module.exports = Order;
