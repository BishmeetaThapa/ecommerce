require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');

        // Sample users to create
        const users = [
            { name: 'Admin User', email: 'admin@everglow.com', password: 'admin123', role: 'admin' },
            { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'customer' },
            { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'customer' },
            { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123', role: 'customer' },
            { name: 'Alice Williams', email: 'alice@example.com', password: 'password123', role: 'customer' },
            { name: 'Mike Brown', email: 'mike@example.com', password: 'password123', role: 'customer' },
        ];

        // Hash passwords and create users
        for (const userData of users) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = new User({ ...userData, password: hashedPassword });
                await user.save();
                console.log(`Created user: ${userData.email}`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        }

        console.log('User seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
