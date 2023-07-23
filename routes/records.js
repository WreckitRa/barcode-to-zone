// records.js
const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  router.post("/save-record", (req, res) => {
    const {
      username,
      numScannedOrder,
      numUnrecognizedOrders,
      zoneOfEachOrder,
    } = req.body;

    // Check if all required fields are provided
    if (
      !username ||
      numScannedOrder === undefined ||
      numUnrecognizedOrders === undefined ||
      !zoneOfEachOrder
    ) {
      return res.status(400).json({
        message: "Invalid request. Please provide all required fields.",
      });
    }

    const insertRecordQuery =
      "INSERT INTO records (username, number_of_scanned_order, number_of_unrecognized_orders, zone_of_each_order) VALUES (?, ?, ?, ?)";
    const values = [
      username,
      numScannedOrder,
      numUnrecognizedOrders,
      JSON.stringify(zoneOfEachOrder),
    ];

    pool.query(insertRecordQuery, values, (err, result) => {
      if (err) {
        console.error("Error saving record:", err);
        return res
          .status(500)
          .json({ message: "An error occurred while saving the record." });
      }

      return res.status(200).json({ message: "Record saved successfully." });
    });
  });

  return router;
};
