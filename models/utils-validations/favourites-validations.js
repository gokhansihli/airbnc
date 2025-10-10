exports.validateInsertPropertyFavourite = async (id, guest_id) => {
  if (isNaN(id))
    return Promise.reject({
      status: 400,
      msg: "Property id should be number!",
    });

  if (!guest_id)
    return Promise.reject({ status: 400, msg: "Guest id should be provided!" });
  if (isNaN(guest_id))
    return Promise.reject({ status: 400, msg: "Guest id should be number!" });
};

exports.validateRemovePropertyUserFavourite = async (property_id, user_id) => {
  if (property_id && isNaN(property_id))
    return Promise.reject({
      status: 400,
      msg: "Property value should be a number!",
    });
  if (user_id && isNaN(user_id))
    return Promise.reject({
      status: 400,
      msg: "User value should be a number!",
    });
};
