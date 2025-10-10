const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");
const {
  ValidateFetchProperties,
  validateFetchPropertyById,
} = require("./utils-validations/properties-validations");

exports.fetchProperties = async (
  minprice,
  maxprice,
  property_type,
  sort = "favourite",
  order = "DESC",
  host,
  amenity
) => {
  const orderBy = order.toUpperCase();
  const sortLookUp = {
    cost_per_night: "price_per_night",
    popularity: "avg_rating",
    favourite: "favourited_count",
  };

  await ValidateFetchProperties(
    minprice,
    maxprice,
    property_type,
    sort,
    order,
    host,
    amenity
  );

  if (host !== undefined) {
    await checkExists("users", "user_id", host);
  }

  let queryStr = `SELECT properties.property_id, properties.name, properties.location,
    CAST(price_per_night AS INTEGER),
    CONCAT(users.first_name, ' ', users.surname) AS host,
    COUNT(favourites.property_id) AS favourited_count,
    COALESCE(AVG(reviews.rating)::FLOAT, 0) AS avg_rating,
    (SELECT image_url FROM images WHERE images.property_id = properties.property_id
      ORDER BY image_id ASC LIMIT 1) AS image
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON properties.property_id = favourites.property_id
    LEFT JOIN reviews ON properties.property_id = reviews.property_id
    LEFT JOIN property_types ON properties.property_type = property_types.property_type`;

  const queryValues = [];
  const whereConditions = [];

  if (property_type) {
    queryValues.push(`%${property_type}%`);
    whereConditions.push(
      `property_types.property_type ILIKE $${queryValues.length}`
    );
  }

  if (minprice !== undefined) {
    queryValues.push(minprice);
    whereConditions.push(
      `CAST(price_per_night AS INTEGER) >= $${queryValues.length}`
    );
  }

  if (maxprice !== undefined) {
    queryValues.push(maxprice);
    whereConditions.push(
      `CAST(price_per_night AS INTEGER) <= $${queryValues.length}`
    );
  }

  if (host !== undefined) {
    queryValues.push(host);
    whereConditions.push(`properties.host_id = $${queryValues.length}`);
  }

  if (amenity !== undefined) {
    queryStr += `
    JOIN properties_amenities ON properties.property_id = properties_amenities.property_id
    JOIN amenities ON properties_amenities.amenity_slug = amenities.amenity`;
  }

  if (Array.isArray(amenity)) {
    let startIndex = queryValues.length + 1;

    amenity.map((value) => queryValues.push(value));
    const placeholders = amenity.map((val, index) => `$${startIndex + index}`);
    whereConditions.push(`amenities.amenity IN (${placeholders.join(", ")})`);
  }

  if (!Array.isArray(amenity) && amenity !== undefined) {
    queryValues.push(amenity);
    whereConditions.push(`amenities.amenity = $${queryValues.length}`);
  }

  if (whereConditions.length) {
    queryStr += ` WHERE ${whereConditions.join(" AND ")}`;
  }

  queryStr += `
    GROUP BY properties.property_id, properties.name, properties.location, properties.price_per_night, users.first_name, users.surname
  `;

  if (Array.isArray(amenity))
    //After grouping rows, for 'and' logic, counting distinct amenities per group
    queryStr += `HAVING COUNT(DISTINCT amenities.amenity) = ${amenity.length}`;

  queryStr += ` ORDER BY ${sortLookUp[sort]} ${orderBy}`;

  const { rows: properties } = await db.query(queryStr, queryValues);
  return properties;
};

exports.fetchPropertyById = async (id, user_id) => {
  await validateFetchPropertyById(id, user_id);

  await checkExists("properties", "property_id", id, "Property not found!");

  if (user_id !== undefined) {
    await checkExists("users", "user_id", user_id, "User not found!");
  }

  let queryStr = `SELECT properties.property_id, properties.name AS property_name, properties.location, 
    CAST (price_per_night AS INTEGER), 
    properties.description, 
    CONCAT(users.first_name,' ', users.surname) AS host,
    users.avatar AS host_avatar,
    COUNT(favourites.property_id) AS favourited_count,
    ARRAY_AGG(DISTINCT images.image_url) AS images,
    ARRAY_AGG(DISTINCT properties_amenities.amenity_slug) AS amenities`;

  const queryValues = [];
  const whereConditions = [];

  if (user_id !== undefined) {
    queryValues.push(user_id);
    whereConditions.push(`properties.host_id = $${queryValues.length}`);
    queryStr += `, EXISTS (
      SELECT 1 FROM favourites
      WHERE favourites.property_id = properties.property_id
      AND favourites.guest_id = $${queryValues.length}
    ) AS favourited`;
  }

  queryStr += `
    FROM properties
    LEFT JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON properties.property_id = favourites.property_id
    LEFT JOIN images ON properties.property_id = images.property_id
    LEFT JOIN properties_amenities ON properties.property_id = properties_amenities.property_id
  `;

  if (id !== undefined) {
    queryValues.push(id);
    whereConditions.push(`properties.property_id = $${queryValues.length}`);
  }

  if (whereConditions.length) {
    queryStr += ` WHERE ${whereConditions.join(" AND ")}`;
  }

  queryStr += ` GROUP BY properties.property_id, properties.name, properties.location, properties.price_per_night, properties.description, users.first_name, users.surname, users.avatar;`;
  const {
    rows: [property],
  } = await db.query(queryStr, queryValues);

  return property;
};
