import mongoose from 'mongoose';

const dropIndex = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/billingchalan');
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('customers');

        // List indexes first
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        // Drop the specific index
        try {
            await collection.dropIndex('createdBy_1_email_1');
            console.log('Successfully dropped index: createdBy_1_email_1');
        } catch (err) {
            console.log('Error dropping index (might not exist):', err.message);
        }

        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

dropIndex();
