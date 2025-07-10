import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load env vars

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB Connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, /* {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } */);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit on failure
  }
};

export default connectDB;
