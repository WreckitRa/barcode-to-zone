// auth.js
const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // Admin Login API
  router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    pool.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json({ message: "Database connection error." });
      }

      const checkAdminQuery =
        "SELECT id FROM admin_auth WHERE username = ? AND password = ?";
      connection.query(
        checkAdminQuery,
        [username, password],
        (err, results) => {
          connection.release();

          if (err) {
            return res
              .status(500)
              .json({ message: `Database query error. ${err}` });
          }

          if (results.length === 1) {
            return res.status(200).json({ message: "Login successful." });
          } else {
            return res
              .status(401)
              .json({ message: "Invalid username or password." });
          }
        }
      );
    });
  });

  return router;
};
