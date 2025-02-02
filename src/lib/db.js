// @lib/db.js
import mongoose from 'mongoose';

let isConnected = false;

async function connectToDatabase() {
    try {
        if(isConnected) {
            console.log("Using existing connection");
            return;
        }
        console.log("Using new connection");
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("Connected to database");
    } catch (error) {
        console.log("Failed to connect to database", error.message);
        process.exit(1);
    }
}

export default connectToDatabase;
