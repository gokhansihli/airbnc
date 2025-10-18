exports.validateInsertLogin = async (email) => {
  if (!email) {
    return Promise.reject({
      status: 400,
      msg: "Email should be provided!",
    });
  }
};
