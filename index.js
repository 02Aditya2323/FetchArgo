const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { fetchAndStoreArgoData } = require("./services/fetchArgo");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/FetchData")
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Import and use routes
const DataRoute = require("./router/Data.js");
app.use("/user", DataRoute);

// Test endpoint to trigger manual fetch
// app.get("/fastfetch", async (req, res) => {
//   try {
//     console.log("Manual fetch triggered...");
//     const result = await fetchAndStoreArgoData();
//     res.json({ success: true, data: result });
//   } catch (error) {
//     console.error("Error in manual fetch:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// Start the cron job
require('./services/CRONJOBS');

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log(`- http://localhost:${PORT}/fastfetch (manual fetch)`);
  console.log(`- http://localhost:${PORT}/user (view all data)\n`);
});
