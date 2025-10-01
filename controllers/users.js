const { fetchUsers } = require("../models/users");

exports.getUsers = async (req, res, next) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send({ msg: "Invalid user value!" });
  }

  const user = await fetchUsers(id);

  if (!user) {
    res.status(404).send({ msg: "User not found!" });
  }

  res.status(200).send({ user });
};
