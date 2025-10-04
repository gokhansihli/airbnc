const { fetchUserById, updateUser } = require("../models/users");

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await fetchUserById(id);
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

exports.patchUser = async (req, res, next) => {
  const fieldstoUpdate = req.body;
  const { id } = req.params;

  try {
    const user = await updateUser(fieldstoUpdate, id);
    await res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
