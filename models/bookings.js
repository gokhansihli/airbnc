const db = require("../db/connection");
const checkExists = require("./utils-validations/check-exist");
const {
  ValidateFetchPropertyBookings,
  validateInsertPropertyBooking,
  validateRemoveBooking,
  validateUpdateBooking,
  validateFetchUserBookings,
} = require("./utils-validations/bookings-validations");

exports.fetchPropertyBookings = async (id, guest_id) => {
  await ValidateFetchPropertyBookings(id);
  await checkExists("properties", "property_id", id, "Property not found!");

  let queryStr = `SELECT bookings.booking_id, bookings.check_in_date, bookings.check_out_date, bookings.created_at
    FROM bookings
    WHERE bookings.property_id = $1 AND bookings.guest_id =$2
    ORDER BY bookings.check_out_date DESC;`;

  const { rows: bookings } = await db.query(queryStr, [id, guest_id]);

  const property_id = +id;

  return { bookings, property_id };
};

exports.insertPropertyBooking = async (
  id,
  guest_id,
  check_in_date,
  check_out_date,
  signedUserId
) => {
  await validateInsertPropertyBooking(
    id,
    guest_id,
    check_in_date,
    check_out_date
  );
  await checkExists("properties", "property_id", id, "Property not found!");
  await checkExists("users", "user_id", guest_id, "User not found!");

  if (signedUserId !== +guest_id) {
    return Promise.reject({ status: 403, msg: "Access denied!" });
  }

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

exports.removeBooking = async (id, signedUserId) => {
  await validateRemoveBooking(id);
  await checkExists("bookings", "booking_id", id, "Booking not found!");

  let queryStr = `DELETE FROM bookings WHERE booking_id = $1 AND guest_id = $2 RETURNING *`;

  const {
    rows: [booking],
  } = await db.query(queryStr, [id, signedUserId]);

  if (!booking) {
    return Promise.reject({ status: 403, msg: "Access denied!" });
  }

  return booking;
};

exports.updateBooking = async (fieldsToUpdate, id, signedUserId) => {
  await checkExists("bookings", "booking_id", id, "Booking not found!");

  const allowedFields = ["check_in_date", "check_out_date"];

  const fields = Object.keys(fieldsToUpdate);

  const validFields = fields.filter((field) => allowedFields.includes(field));

  await validateUpdateBooking(validFields);

  const setUpdate = validFields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  const queryValues = validFields.map((field) => fieldsToUpdate[field]);
  queryValues.push(id);
  queryValues.push(signedUserId);

  let queryStr = `UPDATE bookings
    SET ${setUpdate}
    WHERE booking_id = $${validFields.length + 1} AND guest_id = $${
    validFields.length + 2
  } RETURNING *`;

  const {
    rows: [booking],
  } = await db.query(queryStr, queryValues);

  if (!booking) {
    return Promise.reject({ status: 403, msg: "Access denied!" });
  }

  return booking;
};

exports.fetchUserBookings = async (id, user_id) => {
  await validateFetchUserBookings(id);
  await checkExists("users", "user_id", id, "User not found!");

  if (user_id !== +id) {
    return Promise.reject({ status: 403, msg: "Access denied!" });
  }

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
