const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { User } = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const email = 'vikaspal90042@gmail.com';
        const password = 'Vikas@2025';

        let admin = await User.findOne({ email });

        if (admin) {
            console.log('Admin user already exists');
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
            await admin.save();
            console.log('Admin password updated');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            admin = new User({
                email,
                password: hashedPassword,
                role: 'admin',
            });

            await admin.save();
            console.log('Admin user created successfully');
        }

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();

