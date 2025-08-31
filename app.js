// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ✅ Autoriser le frontend React (http://localhost:5173 par défaut)
app.use(cors({
  origin: "http://localhost:5173",  // ton frontend
  credentials: true                 // obligatoire si tu utilises withCredentials côté axios
}));

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

module.exports = app;
