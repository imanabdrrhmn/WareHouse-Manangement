require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('./models/User'); 
const sequelize = require('./config/database'); 

const seedAdmin = async () => {
    try {
        await sequelize.sync();

        const hashedPassword = await bcrypt.hash('admin112', 10);

        const admin = await User.create({
            username: 'admin',
            password: hashedPassword,
            email: 'admin@example.com',
            role: 'Admin'
        });

        console.log('Admin account created:', admin.username);
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await sequelize.close();
    }
};

seedAdmin();
