import mongoose from "mongoose";

export const connectToMongoDb = async () => {
  try {
    console.log("trying connect to database");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {}
};
  