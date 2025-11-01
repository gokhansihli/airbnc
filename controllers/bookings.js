const {
  fetchPropertyBookings,
  insertPropertyBooking,
  removeBooking,
  updateBooking,
  fetchUserBookings,
} = require("../models/bookings");

exports.getPropertyBookings = async (req, res, next) => {
  const { id } = req.params;
  const guest_id = req.user.id;

  const { bookings, property_id } = await fetchPropertyBookings(id, guest_id);

  res.status(200).send({ bookings, property_id });
};

exports.postPropertyBooking = async (req, res, next) => {
  const { guest_id, check_in_date, check_out_date } = req.body;
  const { id } = req.params;

  const signedUserId = req.user.id;

  const booking = await insertPropertyBooking(
    id,
    guest_id,
    check_in_date,
    check_out_date,
    signedUserId
  );

  res
    .status(201)
    .send({ msg: "Booking successful", booking_id: booking.booking_id });
};

exports.deleteBooking = async (req, res, next) => {
  const { id } = req.params;
  const signedUserId = req.user.id;

  const booking = await removeBooking(id, signedUserId);

  res.status(204).send({ booking });
};

exports.patchBooking = async (req, res, next) => {
  const fieldsToUpdate = req.body;
  const { id } = req.params;
  const signedUserId = req.user.id;

  const booking = await updateBooking(fieldsToUpdate, id, signedUserId);

  res.status(200).send({ booking });
};

exports.getUserBookings = async (req, res, next) => {
  const { id } = req.params;

  const user_id = req.user.id;

  const bookings = await fetchUserBookings(id, user_id);

  res.status(200).send({ bookings });
};
