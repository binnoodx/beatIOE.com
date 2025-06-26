import mongoose from "mongoose";

export async function dbConnect() {
    try {
        await mongoose.connect("mongodb+srv://admin:adminLogin@crackcluster.pds7tle.mongodb.net/userDetails");

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB Connected");
        });

        // ✅ Fix 2: Add 'error' event with the error object
        connection.on("error", (err) => {
            console.log("MongoDB connection error:", err);
            process.exit(1); // Exit with error code
        });

    } catch (error) {
        console.log("Database connection error:", error);
    }
}
