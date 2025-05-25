import db from "../db/db.js";

try {
  // Drop existing tables in correct order (reverse dependencies)
  await db.query(`DROP TABLE IF EXISTS reviews`);
  await db.query(`DROP TABLE IF EXISTS photos`);
  await db.query(`DROP TABLE IF EXISTS properties`);

  // Create Properties Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      postal_code VARCHAR(20),
      country VARCHAR(100),
      latitude DECIMAL(9,6),
      longitude DECIMAL(9,6),
      price DECIMAL(12,2),
      description TEXT,
      type TEXT,
      user_id INT,
      bedrooms INT,
      category TEXT,
      sold BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Photos Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      url TEXT,
      user_id INT,
      property_id INT,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Reviews Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      reviewer_id INT NOT NULL,
      property_id INT NOT NULL,
      review TEXT NOT NULL,
      rating INT NOT NULL,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await db.query(`
      CREATE TABLE IF NOT EXISTS liked(
      id SERIAL PRIMARY KEY,
      userid INT,
      propertyid INT,
      liked BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (userid) REFERENCES users(id),
      FOREIGN KEY (propertyid) REFERENCES properties(id)
  )`)

  console.log("Dropped and recreated tables successfully");
} catch (error) {
  console.error("Error while recreating tables:", error);
}
