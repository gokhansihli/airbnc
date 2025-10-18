exports.validateInsertSignup = async (first_name, surname, email) => {
  if (!first_name) {
    return Promise.reject({
      status: 400,
      msg: "First name should be provided!",
    });
  }
  if (!surname) {
    return Promise.reject({
      status: 400,
      msg: "Surname should be provided!",
    });
  }
  if (!email) {
    return Promise.reject({
      status: 400,
      msg: "Email should be provided!",
    });
  }
};
