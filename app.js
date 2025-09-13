const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ✅ Autoriser le frontend React
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

module.exports = app;
