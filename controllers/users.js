const { fetchUserById, updateUser } = require("../models/users");

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;

  const user = await fetchUserById(id);

  res.status(200).send({ user });
};

exports.patchUser = async (req, res, next) => {
  const fieldstoUpdate = req.body;
  const { id } = req.params;

  const user = await updateUser(fieldstoUpdate, id);

  await res.status(200).send({ user });
};
