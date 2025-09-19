const db = require("../connection");
const format = require("pg-format");

const formatUsers = require("../../utils/format-users");
const formatPropertyTypes = require("../../utils/format-property-types");
const formatProperties = require("../../utils/format-properties");
const formatReviews = require("../../utils/format-reviews");
const formatImages = require("../../utils/format-images");
const formatFavourites = require("../../utils/format-favourites");
const formatBookings = require("../../utils/format-bookings");
const formatAmenities = require("../../utils/format-amenities");
const formatPropertiesAmenities = require("../../utils/format-properties_amenities");

async function insertData(
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData
) {
  const insertedUsers = await db.query(
    format(
      `INSERT INTO users 
    (first_name, surname, email, phone_number, is_host, avatar)
    VALUES %L RETURNING *;`,
      formatUsers(usersData)
    )
  );

  await db.query(
    format(
      `INSERT INTO property_types 
    (property_type, description)
    VALUES %L`,
      formatPropertyTypes(propertyTypesData)
    )
  );

  const insertedProperties = await db.query(
    format(
      `INSERT INTO properties 
    (host_id, name, location, property_type, price_per_night, description)
    VALUES %L RETURNING *;`,
      formatProperties(propertiesData, insertedUsers.rows)
    )
  );

  await db.query(
    format(
      `INSERT INTO reviews 
    (property_id, guest_id, rating, comment, created_at)
    VALUES %L`,
      formatReviews(reviewsData, insertedUsers.rows, insertedProperties.rows)
    )
  );

  await db.query(
    format(
      `INSERT INTO images 
    (property_id, image_url, alt_text)
    VALUES %L`,
      formatImages(imagesData, insertedProperties.rows)
    )
  );

  await db.query(
    format(
      `INSERT INTO favourites 
    (guest_id, property_id)
    VALUES %L`,
      formatFavourites(
        favouritesData,
        insertedUsers.rows,
        insertedProperties.rows
      )
    )
  );

  try {
    await db.query(
      format(
        `INSERT INTO bookings 
      (property_id, guest_id, check_in_date, check_out_date)
      VALUES %L`,
        formatBookings(
          bookingsData,
          insertedUsers.rows,
          insertedProperties.rows
        )
      )
    );
  } catch (err) {
    if (err.code === "23P01") {
      throw new Error(
        "This property is already booked for the selected dates."
      );
    }
  }

  await db.query(
    format(
      `INSERT INTO amenities 
    (amenity)
    VALUES %L`,
      formatAmenities(propertiesData)
    )
  );

  await db.query(
    format(
      `INSERT INTO properties_amenities 
    (property_id, amenity_slug)
    VALUES %L`,
      formatPropertiesAmenities(propertiesData, insertedProperties.rows)
    )
  );
}

module.exports = insertData;
