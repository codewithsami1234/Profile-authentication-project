import mongoose from "mongoose";
import ENV from "../config.js";

async function connect() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(ENV.ATLAS_URI);
    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
}

export default connect;
