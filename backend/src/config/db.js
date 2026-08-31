const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Database Connected ✅");

    // 1. Users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        hostel_block VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.query(createUsersTable, (err) => {
      if (err) console.error("Error creating users table:", err);
      else {
        // Alter users table to add columns if table already existed
        db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20)", () => {});
        db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS hostel_block VARCHAR(50)", () => {});
        console.log("Users table ready ✅");
      }
    });

    // 2. Products table
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url TEXT,
        item_condition VARCHAR(50) DEFAULT 'Good',
        status VARCHAR(20) DEFAULT 'AVAILABLE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    db.query(createProductsTable, (err) => {
      if (err) console.error("Error creating products table:", err);
      else console.log("Products table ready ✅");
    });

    // 3. Buy Requests table
    const createRequestsTable = `
      CREATE TABLE IF NOT EXISTS buy_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        buyer_id INT NOT NULL,
        seller_id INT NOT NULL,
        message TEXT,
        buyer_phone VARCHAR(20),
        status VARCHAR(20) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    db.query(createRequestsTable, (err) => {
      if (err) console.error("Error creating buy_requests table:", err);
      else console.log("Buy Requests table ready ✅");
    });
  }
});

module.exports = db;


