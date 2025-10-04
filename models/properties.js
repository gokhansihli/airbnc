const db = require("../db/connection");
const checkExists = require("../db/utils/check-exist");

exports.fetchProperties = async (
  minprice,
  maxprice,
  property_type,
  sort = "favourite",
  order = "DESC",
  host
) => {
  if ([minprice, maxprice].some((price) => price != null && isNaN(price)))
    throw { status: 400, msg: "Invalid price value!" };

  const propertyTypes = ["APARTMENT", "HOUSE", "STUDIO"];
  if (property_type && !propertyTypes.includes(property_type.toUpperCase()))
    throw { status: 400, msg: "Invalid property type value!" };

  const allowedOrder = ["ASC", "DESC"];
  const orderBy = order.toUpperCase();
  if (!allowedOrder.includes(orderBy))
    throw { status: 400, msg: "Invalid order value!" };

  const sortLookUp = {
    cost_per_night: "price_per_night",
    popularity: "avg_rating",
    favourite: "favourited_count",
  };
  if (!(sort in sortLookUp)) throw { status: 400, msg: "Invalid sort value!" };

  if (host && isNaN(host)) throw { status: 400, msg: "Invalid host value!" };

  if (host !== undefined) {
    await checkExists("users", "user_id", host);
  }

  let queryStr = `SELECT properties.property_id, properties.name, properties.location, 
        CAST (price_per_night AS INTEGER),
        CONCAT(users.first_name,' ', users.surname) AS host,
        COUNT(favourites.property_id) AS favourited_count,
        COALESCE(AVG(reviews.rating)::FLOAT, 0) AS avg_rating,
        (SELECT image_url FROM images WHERE images.property_id = properties.property_id
          ORDER BY image_id ASC LIMIT 1) AS image
        FROM properties
        JOIN users ON properties.host_id = users.user_id
        LEFT JOIN favourites ON properties.property_id = favourites.property_id
        LEFT JOIN property_types ON properties.property_type = property_types.property_type
        LEFT JOIN reviews ON properties.property_id = reviews.property_id`;

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
      `CAST (price_per_night AS INTEGER) >= $${queryValues.length}`
    );
  }
  if (maxprice !== undefined) {
    queryValues.push(maxprice);
    whereConditions.push(
      `CAST (price_per_night AS INTEGER) <= $${queryValues.length}`
    );
  }

  if (host !== undefined) {
    queryValues.push(host);
    whereConditions.push(`properties.host_id = $${queryValues.length}`);
  }

  if (whereConditions.length) {
    queryStr += ` WHERE ${whereConditions.join(" AND ")}`;
  }

  queryStr += ` GROUP BY properties.property_id, properties.name, properties.location, properties.price_per_night, users.first_name, users.surname`;

  queryStr += ` ORDER BY ${sortLookUp[sort]} ${orderBy}`;

  const { rows: properties } = await db.query(queryStr, queryValues);

  return properties;
};

exports.fetchPropertyById = async (id, user_id) => {
  if (isNaN(id)) {
    throw { status: 400, msg: "Invalid property value!" };
  }
  if (user_id && isNaN(user_id)) {
    throw { status: 400, msg: "Invalid user id value!" };
  }

  await checkExists("properties", "property_id", id);

  if (user_id !== undefined) {
    await checkExists("users", "user_id", user_id);
  }

  let queryStr = `SELECT properties.property_id, properties.name AS property_name, properties.location, 
    CAST (price_per_night AS INTEGER), 
    properties.description, 
    CONCAT(users.first_name,' ', users.surname) AS host,
    users.avatar AS host_avatar,
    COUNT(favourites.property_id) AS favourited_count,
    ARRAY_AGG(images.image_url ORDER BY images.image_id) AS images`;

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
