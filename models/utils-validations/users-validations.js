exports.validateFetchUserById = async (id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: "User value should be a number!",
    });
  }
};

exports.validateUpdateUser = async (validFields) => {
  if (validFields.length === 0)
    return Promise.reject({ status: 400, msg: "Invalid field!" });
};
