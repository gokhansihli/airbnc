const db = require("../connection");

async function createTables() {
  await db.query(`CREATE TABLE users (
                    user_id SERIAL PRIMARY KEY,
                    first_name VARCHAR NOT NULL,
                    surname VARCHAR NOT NULL,
                    email VARCHAR NOT NULL,
                    phone_number VARCHAR,
                    is_host BOOLEAN NOT NULL,
                    avatar VARCHAR,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );`);

  await db.query(`CREATE TABLE property_types (
                    property_type VARCHAR NOT NULL PRIMARY KEY,
                    description TEXT NOT NULL
                    );`);

  await db.query(`CREATE TABLE properties (
                    property_id SERIAL PRIMARY KEY,
                    host_id INT NOT NULL REFERENCES users(user_id),
                    name VARCHAR NOT NULL,
                    location VARCHAR NOT NULL,
                    property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
                    price_per_night DECIMAL NOT NULL, 
                    description TEXT
                    );`);

  await db.query(`CREATE TABLE reviews (
                    review_id SERIAL PRIMARY KEY,
                    property_id INT NOT NULL REFERENCES properties(property_id),
                    guest_id INT NOT NULL REFERENCES users(user_id),
                    rating INT NOT NULL,
                    comment TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );`);
  await db.query(`CREATE TABLE images (
                    image_id SERIAL PRIMARY KEY,
                    property_id INT NOT NULL REFERENCES properties(property_id),
                    image_url VARCHAR NOT NULL,
                    alt_text VARCHAR NOT NULL
                    );`);
  await db.query(`CREATE TABLE favourites (
                    favourite_id SERIAL PRIMARY KEY,
                    guest_id INT NOT NULL REFERENCES users(user_id),
                    property_id INT NOT NULL REFERENCES properties(property_id)
                    );`);

  await db.query(`CREATE EXTENSION IF NOT EXISTS btree_gist;`);

  await db.query(`CREATE TABLE bookings (
                    booking_id SERIAL PRIMARY KEY,
                    property_id INT NOT NULL REFERENCES properties(property_id),
                    guest_id INT NOT NULL REFERENCES users(user_id),
                    check_in_date DATE NOT NULL,
                    check_out_date DATE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    EXCLUDE USING GIST (property_id WITH =,DATERANGE(check_in_date, check_out_date, '[)') WITH &&),
                    CHECK (check_out_date > check_in_date)
                    );`);
  await db.query(`CREATE TABLE amenities (
                    amenity VARCHAR PRIMARY KEY
                    );`);
  await db.query(`CREATE TABLE properties_amenities (
                    property_amenity_id SERIAL PRIMARY KEY,
                    property_id INT NOT NULL REFERENCES properties(property_id),
                    amenity_slug VARCHAR NOT NULL REFERENCES amenities(amenity)
                    );`);
}

module.exports = createTables;
