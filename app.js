// app.js
const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database");
const app = express();
const mysql = require("mysql");
const port = 8080;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "admin1234",
  database: "barcode_scanner",
});

// Create the tables before starting the server
database.createTables(pool);

const authRoutes = require("./routes/auth")(pool);
const recordsRoutes = require("./routes/records")(pool);
const barcodeRoutes = require("./routes/barcode")(pool);
const warehouseRoutes = require("./routes/warehouse")(pool);

// Use the route handlers
app.use(authRoutes);
app.use(recordsRoutes);
app.use(barcodeRoutes);
app.use(warehouseRoutes);

// Rest of your API routes and logic...

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
