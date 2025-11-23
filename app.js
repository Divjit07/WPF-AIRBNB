/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Divjit Singh     Student ID: N01719435     Date: ____________________
*
******************************************************************************/

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();

// ===============================
// Middleware
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// Handlebars Setup
// ===============================
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    helpers: {
      eq: (a, b) => a === b,
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
    },
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// ===============================
// CONNECT TO AIRBNB DB (ONLY ONE CONNECTION!)
// ===============================
mongoose
  .connect(process.env.MONGO_URI_AIRBNB, {
    serverSelectionTimeoutMS: 10000, // prevents buffering timeout
  })
  .then(() => console.log("Connected to MongoDB Atlas (Airbnb_DB)"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Debug logs
mongoose.connection.on("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("error", (err) => console.log("Mongoose error:", err));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected"));

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose disconnected on app termination");
  process.exit(0);
});

// ===============================
// HOME PAGE
// ===============================
app.get("/", (req, res) => {
  res.send(`
    <h1>Hello, welcome to my assignment!</h1>
    <p>This project includes API routes and Handlebars UI pages.</p>

    <h3>Available Links:</h3>
    <ul>
      <li><a href="/api/employees">API: Employee Routes (Q1)</a></li>
      <li><a href="/api/airbnb">API: All Airbnb Listings (Q2)</a></li>
      <li><a href="/airbnb_hbs">HBS: Home Page</a></li>
      <li><a href="/airbnb_hbs/list">HBS: All Listings Page</a></li>
      <li><a href="/airbnb_hbs/search">HBS: Search by ID/Name</a></li>
    </ul>

    <h3>Made by: <strong>Divjit Singh</strong> — N01719435</h3>
  `);
});

// ===============================
// Load Routes
// ===============================
app.use("/api/employees", require("./routes/employees"));
app.use("/api/airbnb", require("./routes/airbnb"));
app.use("/airbnb_hbs", require("./routes/airbnb_hbs"));

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors,
    });
  }

  res.status(500).json({ message: "Internal Server Error" });
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
