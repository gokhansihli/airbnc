const db = require("../connection");
const format = require("pg-format");

const {
  formatUsers,
  formatPropertyTypes,
  formatProperties,
  formatReviews,
  formatImages,
  formatFavourites,
  formatBookings,
  formatAmenities,
  formatPropertiesAmenities,
} = require("../utils/format-datas");

async function insertUsersData(usersData) {
  const insertedUsers = await db.query(
    format(
      `INSERT INTO users 
    (first_name, surname, email, phone_number, is_host, avatar, password_hash)
    VALUES %L RETURNING *;`,
      formatUsers(usersData)
    )
  );
  return insertedUsers;
}

async function insertPropertyTypesData(propertyTypesData) {
  await db.query(
    format(
      `INSERT INTO property_types 
    (property_type, description)
    VALUES %L`,
      formatPropertyTypes(propertyTypesData)
    )
  );
}

async function insertPropertiesData(propertiesData, insertedUsers) {
  const insertedProperties = await db.query(
    format(
      `INSERT INTO properties 
    (host_id, name, location, property_type, price_per_night, description)
    VALUES %L RETURNING *;`,
      formatProperties(propertiesData, insertedUsers)
    )
  );
  return insertedProperties;
}

async function insertReviewsData(
  reviewsData,
  insertedUsers,
  insertedProperties
) {
  await db.query(
    format(
      `INSERT INTO reviews 
    (property_id, guest_id, rating, comment, created_at)
    VALUES %L`,
      formatReviews(reviewsData, insertedUsers, insertedProperties)
    )
  );
}
async function insertImagesData(imagesData, insertedProperties) {
  await db.query(
    format(
      `INSERT INTO images 
    (property_id, image_url, alt_text)
    VALUES %L`,
      formatImages(imagesData, insertedProperties)
    )
  );
}

async function insertFavouritesData(
  favouritesData,
  insertedUsers,
  insertedProperties
) {
  await db.query(
    format(
      `INSERT INTO favourites 
    (guest_id, property_id)
    VALUES %L`,
      formatFavourites(favouritesData, insertedUsers, insertedProperties)
    )
  );
}

async function insertBookingsData(
  bookingsData,
  insertedUsers,
  insertedProperties
) {
  try {
    await db.query(
      format(
        `INSERT INTO bookings 
      (property_id, guest_id, check_in_date, check_out_date)
      VALUES %L`,
        formatBookings(bookingsData, insertedUsers, insertedProperties)
      )
    );
  } catch (err) {
    if (err.code === "23P01") {
      throw new Error(
        "This property is already booked for the selected dates."
      );
    }
  }
}

async function insertAmenitiesData(propertiesData) {
  await db.query(
    format(
      `INSERT INTO amenities 
    (amenity)
    VALUES %L`,
      formatAmenities(propertiesData)
    )
  );
}

async function insertPropertiesAmenitiesData(
  propertiesData,
  insertedProperties
) {
  await db.query(
    format(
      `INSERT INTO properties_amenities 
    (property_id, amenity_slug)
    VALUES %L`,
      formatPropertiesAmenities(propertiesData, insertedProperties)
    )
  );
}

module.exports = {
  insertUsersData,
  insertPropertyTypesData,
  insertPropertiesData,
  insertReviewsData,
  insertImagesData,
  insertFavouritesData,
  insertBookingsData,
  insertAmenitiesData,
  insertPropertiesAmenitiesData,
};
