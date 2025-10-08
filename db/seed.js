const dropTables = require("./queries/drops");
const createTables = require("./queries/creates");
const {
  insertUsersData,
  insertPropertyTypesData,
  insertPropertiesData,
  insertReviewsData,
  insertImagesData,
  insertFavouritesData,
  insertBookingsData,
  insertAmenitiesData,
  insertPropertiesAmenitiesData,
} = require("./queries/inserts");

async function seed({
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData,
}) {
  await dropTables();

  await createTables();

  const { rows: insertedUsers } = await insertUsersData(usersData);
  await insertPropertyTypesData(propertyTypesData);
  const { rows: insertedProperties } = await insertPropertiesData(
    propertiesData,
    insertedUsers
  );
  await insertAmenitiesData(propertiesData);
  await insertPropertiesAmenitiesData(propertiesData, insertedProperties);
  await insertReviewsData(reviewsData, insertedUsers, insertedProperties);
  await insertImagesData(imagesData, insertedProperties);
  await insertFavouritesData(favouritesData, insertedUsers, insertedProperties);
  await insertBookingsData(bookingsData, insertedUsers, insertedProperties);
}

module.exports = seed;
