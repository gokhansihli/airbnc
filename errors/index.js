exports.handlePathNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
};

exports.handleInvalidMethods = (req, res, next) => {
  res.status(405).send({ msg: "Invalid method!" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleBadRequests = (err, req, res, next) => {
  if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Bad Request!" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
};
