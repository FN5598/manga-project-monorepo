import mongoose from "mongoose";
import chalk from "chalk";

export const connectToDb = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(
      chalk.red("[ERROR]:"),
      "MONGO_URI is not defined in environment variables",
    );
    process.exit(1);
  }

  /*
   * Connection event listeners for better logging and error handling
   */
  mongoose.connection.on("connected", () => {
    console.log(chalk.green("[DB] MongoDB connection established"));
  });

  mongoose.connection.on("error", (err) => {
    console.error(
      chalk.red("[DB ERROR] Connection error:"),
      err instanceof Error ? err.message : err,
    );
    process.exit(1); // Exit on DB connection error to prevent server from running without DB access
  });

  mongoose.connection.on("disconnected", () => {
    console.warn(chalk.yellow("[DB] MongoDB connection disconnected"));
    process.exit(1); // Exit if DB connection is lost after initial connection
  });

  // Prevent open connections on server termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log(chalk.yellow("[DB] Connection closed due to app termination"));
    process.exit(0);
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout for initial connection
  });
};
