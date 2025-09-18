const dropTables = require("./queries/drops");
const createTables = require("./queries/creates");
const insertData = require("./queries/inserts");

async function seed(
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData
) {
  await dropTables();

  await createTables();

  await insertData(
    usersData,
    propertyTypesData,
    propertiesData,
    reviewsData,
    imagesData,
    favouritesData,
    bookingsData
  );
}

module.exports = seed;
