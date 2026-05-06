import mongoose from "mongoose";

export async function connectDB() {
  mongoose.set("strictQuery", true);

  const uri = process.env.MONGO_URI;
  if (!uri) {
    process.env.USE_MOCK_DATA = "true";
    // eslint-disable-next-line no-console
    console.log("MONGO_URI not set. Using mock project data mode.");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (error) {
    const msg = String(error?.message || error);
    const hint =
      msg.includes("ECONNREFUSED") || msg.includes("Server selection timed out")
        ? "MongoDB is not reachable. Start MongoDB (or point MONGO_URI to MongoDB Atlas) then retry."
        : "Check that MONGO_URI is correct and MongoDB is running.";

    const err = new Error(`MongoDB connection failed: ${msg}. ${hint}`);
    err.status = 500;
    throw err;
  }
}
