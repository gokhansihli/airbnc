exports.validateInsertPropertyReview = async (guest_id, rating, comment) => {
  if (!comment) {
    return Promise.reject({ status: 400, msg: "Comment should be provided!" });
  }
  if (!rating) {
    return Promise.reject({ status: 400, msg: "Rating should be provided!" });
  }
  if (!guest_id) {
    return Promise.reject({ status: 400, msg: "Guest id should be provided!" });
  }
  if (isNaN(guest_id)) {
    return Promise.reject({ status: 400, msg: "Guest id should be a number!" });
  }
  if (isNaN(rating)) {
    return Promise.reject({ status: 400, msg: "Rating should be a number!" });
  }
};

exports.validateRemoveReview = async (id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: "Review id should be a number!",
    });
  }
};
