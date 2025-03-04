import mongoose from "mongoose";

export const connectToDatabase = async (url: string): Promise<void> => {
  try {
    await mongoose.connect(url);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};