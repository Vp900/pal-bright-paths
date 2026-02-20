const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('❌ MONGO_URI is missing in environment variables');
            process.exit(1);
        }

        // Using Mongoose with recommended options for latest Node/Windows
        await mongoose.connect(mongoUri, {

            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        console.log('✅ Connected to MongoDB (UVAL)');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        console.log('💡 TIP: If you see "querySrv ECONNREFUSED", it means your DNS cannot resolve +srv records.');
        console.log('🔗 Please try the "Standard Connection String" (starts with mongodb://) from Atlas.');
        process.exit(1);
    }
};

module.exports = connectDB;
