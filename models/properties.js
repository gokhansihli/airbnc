const db = require("../db/connection");

exports.fetchProperties = async (
  minprice,
  maxprice,
  property_type,
  sort,
  order
) => {
  let queryStr = `SELECT properties.property_id, properties.name, properties.location, 
        CAST (price_per_night AS INTEGER),
        CONCAT(users.first_name,' ', users.surname) AS host,
        COUNT(favourites.property_id) AS favourited_count,
        COALESCE(AVG(reviews.rating)::FLOAT, 0) AS avg_rating
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

  if (whereConditions.length) {
    queryStr += ` WHERE ${whereConditions.join(" AND ")}`;
  }

  queryStr += ` GROUP BY properties.property_id, properties.name, properties.location, properties.price_per_night, users.first_name, users.surname`;

  const allowedOrder = ["ASC", "DESC"];
  const orderBy = allowedOrder.includes(order && order.toUpperCase())
    ? order.toUpperCase()
    : "DESC";

  if (sort === "cost_per_night") {
    queryStr += ` ORDER BY price_per_night ${orderBy}`;
  } else if (sort === "popularity") {
    queryStr += ` ORDER BY avg_rating ${orderBy}`;
  } else {
    queryStr += ` ORDER BY favourited_count ${orderBy};`;
  }

  const { rows: properties } = await db.query(queryStr, queryValues);

  return properties;
};

exports.fetchPropertyById = async (id, user_id) => {
  let queryStr = `SELECT properties.property_id, properties.name AS property_name, properties.location, 
    CAST (price_per_night AS INTEGER), 
    properties.description, 
    CONCAT(users.first_name,' ', users.surname) AS host,
    users.avatar AS host_avatar,
    COUNT(favourites.property_id) AS favourited_count`;

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
