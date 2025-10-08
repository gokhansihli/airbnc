const db = require("../db/connection");

exports.fetchAmenities = async () => {
  let queryStr = `SELECT amenity AS amenity_slug, amenity AS amenity_text 
  FROM amenities;`;

  const { rows: amenities } = await db.query(queryStr);

  return amenities;
};
