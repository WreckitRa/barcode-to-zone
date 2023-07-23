// barcode.js
const express = require("express");
const router = express.Router();
const database = require("../database");
// API route to check the barcode and find the zone
module.exports = (pool) => {
  router.post("/check-barcode", (req, res) => {
    const { barcode, warehouse } = req.body;

    // Check if all required fields are provided
    if (!barcode || !warehouse) {
      return res.status(400).json({
        message: "Invalid request. Please provide all required fields.",
      });
    }

    // First, check if the barcode exists in the orders table
    const checkBarcodeQuery = "SELECT * FROM `order` WHERE barcode = ?";
    pool.query(checkBarcodeQuery, [barcode], (err, results) => {
      if (err) {
        console.error("Error checking barcode:", err);
        return res
          .status(500)
          .json({ message: "An error occurred while checking the barcode." });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Barcode not found in the orders table." });
      }

      // If the barcode exists, find the zone based on coordinates in the selected warehouse
      const checkZoneQuery =
        "SELECT o.barcode, o.coordinate_lat, o.coordinate_long, w.zone_name FROM `order` o JOIN warehouse w ON o.coordinate_lat >= JSON_UNQUOTE(JSON_EXTRACT(w.zone_coordinates, '$.minLat')) AND o.coordinate_lat <= JSON_UNQUOTE(JSON_EXTRACT(w.zone_coordinates, '$.maxLat')) AND o.coordinate_long >= JSON_UNQUOTE(JSON_EXTRACT(w.zone_coordinates, '$.minLong')) AND o.coordinate_long <= JSON_UNQUOTE(JSON_EXTRACT(w.zone_coordinates, '$.maxLong')) WHERE o.barcode = ? and w.warehouse_name = ?";

      pool.query(
        checkZoneQuery,
        [barcode, warehouse],
        (err, warehouseResult) => {
          if (err) {
            console.error("Error checking warehouse:", err);
            return res.status(500).json({
              message: "An error occurred while checking the warehouse.",
            });
          }

          if (warehouseResult.length === 0) {
            return res.status(404).json({ message: "Warehouse not found." });
          }

          // Parse the zone coordinates (assuming it's a JSON string)
          const zoneName = warehouseResult[0].zone_name;

          // Perform the comparison to find the appropriate zone

          if (zoneName) {
            return res.status(200).json({
              message: "Barcode found in the orders table.",
              zone: zoneName,
            });
          } else {
            return res.status(404).json({
              message:
                "Barcode coordinates do not match any zone in the selected warehouse.",
            });
          }
        }
      );
    });
  });

  return router;
};
