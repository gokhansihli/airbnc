const { fetchUserById, updateUser } = require("../models/users");

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;

  const user_id = req.user.id;

  const user = await fetchUserById(id, user_id);

  res.status(200).send({ user });
};

exports.patchUser = async (req, res, next) => {
  const fieldstoUpdate = req.body;
  const { id } = req.params;

  const user_id = req.user.id;

  const user = await updateUser(fieldstoUpdate, id, user_id);

  await res.status(200).send({ user });
};
