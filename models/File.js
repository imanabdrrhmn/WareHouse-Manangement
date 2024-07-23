const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('File', {
    id: {type: DataTypes.INTEGER, allowNull:false, autoIncrement:true, primaryKey:true},
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    file: { type: DataTypes.STRING, allowNull: true},
    uploadedBy: { 
        type: DataTypes.STRING, 
        allowNull: false,
        references: {
            model: 'Users',
            key: 'username',
    }
},
});

module.exports = { File };
