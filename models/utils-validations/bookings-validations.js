exports.ValidateFetchPropertyBookings = async (id) => {
  if (isNaN(id))
    return Promise.reject({
      status: 400,
      msg: "Property value should be a number!",
    });
};

exports.validateInsertPropertyBooking = async (
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
};

exports.validateRemoveBooking = async (id) => {
  if (isNaN(id))
    return Promise.reject({ status: 400, msg: "Invalid booking value!" });
};

exports.validateUpdateBooking = async (validFields) => {
  if (validFields.length === 0)
    return Promise.reject({ status: 400, msg: "Invalid field!" });
};

exports.validateFetchUserBookings = async (id) => {
  if (isNaN(id))
    return Promise.reject({
      status: 400,
      msg: "User value should be a number!",
    });
};
