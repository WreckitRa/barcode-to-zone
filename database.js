// database.js

// Function to create tables
function createTables(pool) {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const createOrderTableQuery = `
      CREATE TABLE IF NOT EXISTS \`order\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_name VARCHAR(255) NOT NULL,
        coordinate_lat FLOAT NOT NULL,
        coordinate_long FLOAT NOT NULL,
        barcode VARCHAR(255) UNIQUE
      )`;

    const createWarehouseTableQuery = `
      CREATE TABLE IF NOT EXISTS warehouse (
        id INT AUTO_INCREMENT PRIMARY KEY,
        zone_name VARCHAR(255) NOT NULL,
        zone_coordinates VARCHAR(255) NOT NULL,
        zone_color VARCHAR(20) NOT NULL
      )`;

    const createAdminAuthTableQuery = `
      CREATE TABLE IF NOT EXISTS admin_auth (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )`;

    const createRecordsTableQuery = `
      CREATE TABLE IF NOT EXISTS records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        number_of_scanned_order INT NOT NULL,
        number_of_unrecognized_orders INT NOT NULL,
        zone_of_each_order JSON
      )`;

    connection.query(createOrderTableQuery, (err) => {
      if (err) throw err;
    });

    connection.query(createWarehouseTableQuery, (err) => {
      if (err) throw err;
    });

    connection.query(createAdminAuthTableQuery, (err) => {
      if (err) throw err;
    });

    connection.query(createRecordsTableQuery, (err) => {
      if (err) throw err;
    });

    connection.release();
  });
}

module.exports = {
  createTables,
};
