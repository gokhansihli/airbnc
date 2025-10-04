exports.handlePathNotFound = async (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleBadRequests = (err, req, res, next) => {
  const codes = ["23502", "23503", "22P02"];

  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request!" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
};
