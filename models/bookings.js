const db = require("../db/connection");
const checkExists = require("../db/utils/check-exist");

exports.fetchPropertyBookings = async (id) => {
  if (isNaN(id))
    return Promise.reject({ status: 400, msg: "Invalid property value!" });
  await checkExists("properties", "property_id", id);

  let queryStr = `SELECT bookings.booking_id, bookings.check_in_date, bookings.check_out_date, bookings.created_at
    FROM bookings
    WHERE bookings.property_id = $1
    ORDER BY bookings.check_out_date DESC;`;

  const { rows: bookings } = await db.query(queryStr, [id]);

  const property_id = +id;

  return { bookings, property_id };
};

exports.insertPropertyBooking = async (
  id,
  guest_id,
  check_in_date,
  check_out_date
) => {
  if (isNaN(id))
    return Promise.reject({
      status: 400,
      msg: "Property id should be number!",
    });

  if (!guest_id)
    return Promise.reject({ status: 400, msg: "Guest id should be provided!" });
  if (isNaN(guest_id))
    return Promise.reject({ status: 400, msg: "Guest id should be number!" });

  if (!check_in_date)
    return Promise.reject({
      status: 400,
      msg: "Check in date should be provided!",
    });
  if (!check_out_date)
    return Promise.reject({
      status: 400,
      msg: "Check out date should be provided!",
    });

  let queryStr = `INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date)
  VALUES ($1, $2, $3, $4) RETURNING *`;
  try {
    const {
      rows: [booking],
    } = await db.query(queryStr, [id, guest_id, check_in_date, check_out_date]);

    return booking;
  } catch (error) {
    return Promise.reject({
      status: 400,
      msg: "Booking clash with an existing booking!",
    });
  }
};

exports.removeBooking = async (id) => {
  if (isNaN(id))
    return Promise.reject({ status: 400, msg: "Invalid booking value!" });

  await checkExists("bookings", "booking_id", id);

  let queryStr = `DELETE FROM bookings WHERE booking_id = $1 RETURNING *`;

  const {
    rows: [booking],
  } = await db.query(queryStr, [id]);

  return booking;
};

exports.updateBooking = async (fieldsToUpdate, id) => {
  await checkExists("bookings", "booking_id", id);

  const allowedFields = ["check_in_date", "check_out_date"];

  const fields = Object.keys(fieldsToUpdate);

  const validFields = fields.filter((field) => allowedFields.includes(field));

  if (validFields.length === 0)
    return Promise.reject({ status: 400, msg: "Invalid field!" });

  const setUpdate = validFields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  const queryValues = validFields.map((field) => fieldsToUpdate[field]);
  queryValues.push(id);

  let queryStr = `UPDATE bookings
    SET ${setUpdate}
    WHERE booking_id = $${validFields.length + 1} RETURNING *`;

  const {
    rows: [booking],
  } = await db.query(queryStr, queryValues);

  return booking;
};

exports.fetchUserBookings = async (id) => {
  if (isNaN(id))
    return Promise.reject({ status: 400, msg: "Invalid user value!" });
  await checkExists("users", "user_id", id);

  let queryStr = `SELECT bookings.booking_id, bookings.check_in_date, bookings.check_out_date, bookings.property_id, properties.name AS property_name, 
  CONCAT(users.first_name, ' ', users.surname) AS host,
  (SELECT image_url FROM images 
    WHERE images.property_id = bookings.property_id ORDER BY image_id LIMIT 1) AS image
  FROM bookings
  JOIN users ON bookings.guest_id = users.user_id
  INNER JOIN properties ON bookings.property_id = properties.property_id
  WHERE users.user_id = $1
  ORDER BY check_in_date ASC;`;

  const { rows: bookings } = await db.query(queryStr, [id]);

  return bookings;
};
