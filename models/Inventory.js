const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
    productId: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement:true, 
        references: {
        model: 'Products',
        key: 'productId',
    }, 
},
    quantity: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    lastUpdated: { type: DataTypes.DATE, allowNull: false }
}, {
    timestamps: false
});

module.exports = Inventory;
