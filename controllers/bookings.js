const {
  fetchPropertyBookings,
  insertPropertyBooking,
  removeBooking,
  updateBooking,
  fetchUserBookings,
} = require("../models/bookings");

exports.getPropertyBookings = async (req, res, next) => {
  const { id } = req.params;

  const { bookings, property_id } = await fetchPropertyBookings(id);

  res.status(200).send({ bookings, property_id });
};

exports.postPropertyBooking = async (req, res, next) => {
  const { guest_id, check_in_date, check_out_date } = req.body;
  const { id } = req.params;

  const booking = await insertPropertyBooking(
    id,
    guest_id,
    check_in_date,
    check_out_date
  );

  res
    .status(201)
    .send({ msg: "Booking successful", booking_id: booking.booking_id });
};

exports.deleteBooking = async (req, res, next) => {
  const { id } = req.params;

  const booking = await removeBooking(id);

  res.status(204).send({ booking });
};

exports.patchBooking = async (req, res, next) => {
  const fieldsToUpdate = req.body;
  const { id } = req.params;

  const booking = await updateBooking(fieldsToUpdate, id);

  res.status(200).send({ booking });
};

exports.getUserBookings = async (req, res, next) => {
  const { id } = req.params;

  const bookings = await fetchUserBookings(id);

  res.status(200).send({ bookings });
};
