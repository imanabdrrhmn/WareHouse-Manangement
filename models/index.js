const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize, Sequelize);
const Product = require('./Product')(sequelize, Sequelize);
const Order = require('./Order')(sequelize, Sequelize);
const File = require('./File')(sequelize, Sequelize);
const Inventory = require('./Inventory')(sequelize, Sequelize);

// Define associations
User.hasMany(Order, { foreignKey: 'username' });
Order.belongsTo(User, { foreignKey: 'username' });

Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(File, { foreignKey: 'uploadedBy' });
File.belongsTo(User, { foreignKey: 'uploadedBy' });

Product.hasOne(Inventory, { foreignKey: 'productId' });
Inventory.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  Order,
  File,
  Inventory,
};

