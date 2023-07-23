const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // API route to get all available unique warehouses
  router.get("/warehouses", (req, res) => {
    const getWarehousesQuery = "SELECT DISTINCT warehouse_name FROM warehouse";

    pool.query(getWarehousesQuery, (err, results) => {
      if (err) {
        console.error("Error getting warehouses:", err);
        return res
          .status(500)
          .json({ message: "An error occurred while getting warehouses." });
      }

      const warehouses = results.map((result) => result.warehouse_name);
      return res.status(200).json({ warehouses });
    });
  });

  return router;
};
