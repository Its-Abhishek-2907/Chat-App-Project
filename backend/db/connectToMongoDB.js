import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI,);
        console.log('database connected');
    } catch (error) {
        console.log('error connecting to mongoDb', error.message);
    }
};

export default connectToMongoDB;